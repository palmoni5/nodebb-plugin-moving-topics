'use strict';

const plugin = {};

let patchedMove = false;
let originalMove;

function getCore(path) {
	return require.main.require(path);
}

plugin.init = async function () {
	if (patchedMove) {
		return;
	}
	patchedMove = true;

	const topicsApi = getCore('./src/api/topics');
	const privileges = getCore('./src/privileges');
	const topics = getCore('./src/topics');
	const categories = getCore('./src/categories');
	const batch = getCore('./src/batch');
	const socketHelpers = getCore('./src/socket.io/helpers');
	const events = getCore('./src/events');
	const activitypubApi = getCore('./src/api/activitypub');
	const activitypub = getCore('./src/activitypub');
	const user = getCore('./src/user');

	originalMove = topicsApi.move;
	
	topicsApi.move = async function (caller, data) {
		const canMove = await privileges.categories.isAdminOrMod(data.cid, caller.uid);
		if (canMove) {
			return await originalMove(caller, data);
		}

		const tids = Array.isArray(data.tid) ? data.tid : [data.tid];
		const targetCid = parseInt(data.cid, 10);

		const [canCreate, canRead] = await Promise.all([
			privileges.categories.can('topics:create', targetCid, caller.uid),
			privileges.categories.can('topics:read', targetCid, caller.uid),
		]);

		if (!canCreate || !canRead) {
			throw new Error('[[error:no-privileges]]');
		}

		const uids = await user.getUidsFromSet('users:online', 0, -1);
		const cids = [targetCid];

		await batch.processArray(tids, async (batchTids) => {
			await Promise.all(batchTids.map(async (tid) => {
				const topicData = await topics.getTopicFields(tid, [
					'tid',
					'cid',
					'uid',
					'mainPid',
					'slug',
					'deleted',
					'locked',
				]);

				if (!topicData) {
					throw new Error('[[error:no-topic]]');
				}

				const isOwner = parseInt(topicData.uid, 10) === parseInt(caller.uid, 10);
				if (!isOwner || topicData.locked || topicData.deleted) {
					throw new Error('[[error:no-privileges]]');
				}

				if (!cids.includes(topicData.cid)) {
					cids.push(topicData.cid);
				}

				await topics.tools.move(tid, {
					cid: targetCid,
					uid: caller.uid,
				});

				const notifyUids = await privileges.categories.filterUids('topics:read', topicData.cid, uids);
				socketHelpers.emitToUids('event:topic_moved', topicData, notifyUids);

				if (!topicData.deleted) {
					socketHelpers.sendNotificationToTopicOwner(tid, caller.uid, 'move', 'notifications:moved-your-topic');
					activitypubApi.announce.note(caller, { tid });
					const { activity } = await activitypub.mocks.activities.create(topicData.mainPid, caller.uid);
					await activitypub.feps.announce(topicData.mainPid, activity);
				}

				await events.log({
					type: 'topic-move',
					uid: caller.uid,
					ip: caller.ip,
					tid: tid,
					fromCid: topicData.cid,
					toCid: targetCid,
				});
			}));
		}, { batch: 10 });

		await categories.onTopicsMoved(cids);
	};
};

plugin.filterTopicPrivileges = async function (data) {
	const topics = getCore('./src/topics');
	const topicData = await topics.getTopicFields(data.tid, ['uid', 'locked', 'deleted']);
	if (!topicData) {
		return data;
	}

	const isOwner = parseInt(topicData.uid, 10) === parseInt(data.uid, 10);
	data.canMoveOwnTopic = !!(isOwner && !data.isAdminOrMod && !topicData.locked && !topicData.deleted);

	if (data.canMoveOwnTopic && !data.view_thread_tools) {
		data.view_thread_tools = true;
	}

	return data;
};

module.exports = plugin;
