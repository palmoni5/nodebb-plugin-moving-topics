'use strict';

/* global ajaxify */

$(window).on('action:app.load', function () {
	require(['hooks', 'translator'], function (hooks, translator) {
		function canMoveOwnTopic() {
			const privs = ajaxify.data && ajaxify.data.privileges;
			return !!(privs && privs.canMoveOwnTopic);
		}

		function addMoveItem(menuEl) {
			const $menu = $(menuEl);
			if ($menu.find('.plugin-move-own-topic').length) {
				return;
			}

			translator.translate('[[topic:thread-tools.move]]', function (label) {
				const item = [
					'<li>',
					'<a href="#" class="dropdown-item rounded-1 d-flex align-items-center gap-2 plugin-move-own-topic" role="menuitem">',
					'<i class="fa fa-fw fa-arrows text-secondary"></i> ',
					label,
					'</a>',
					'</li>',
				].join('');
				$menu.append(item);
			});
		}

		function bindMoveHandler(menuEl) {
			const $menu = $(menuEl);
			$menu.off('click', '.plugin-move-own-topic').on('click', '.plugin-move-own-topic', function () {
				require(['forum/topic/move'], function (move) {
					move.init([ajaxify.data.tid], ajaxify.data.cid);
				});
				return false;
			});
		}

		hooks.on('action:topic.tools.load', function (data) {
			if (!canMoveOwnTopic()) {
				return;
			}
			addMoveItem(data.element);
			bindMoveHandler(data.element);
		});

		hooks.on('action:category.selector.options', function (data) {
			if (!canMoveOwnTopic()) {
				return;
			}
			const el = data.el;
			if (!el || !el.length) {
				return;
			}
			const inMoveModal = el.closest('.tool-modal').find('#move_thread_commit').length > 0;
			if (inMoveModal) {
				data.options.privilege = 'topics:create';
			}
		});
	});
});
