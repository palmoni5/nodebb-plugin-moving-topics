'use strict';

/* global ajaxify, app */

$(window).on('action:app.load', function () {
	require(['hooks', 'translator'], function (hooks, translator) {
		hooks.on('action:ajaxify.end', function () {
			if (!ajaxify.data || !ajaxify.data.template || !ajaxify.data.template['admin/settings/post']) {
				return;
			}

			if ($('#moving-topics-settings').length) {
				return;
			}

			const sectionHtml = [
				'<hr/>',
				'<div id="moving-topics-settings" class="mb-4">',
				'<h5 class="fw-bold tracking-tight settings-header">[[moving-topics:admin.settings.title]]</h5>',
				'<div class="mb-3">',
				'<label class="form-label" for="movingTopicsMaxPosts">[[moving-topics:admin.settings.max-posts]]</label>',
				'<input id="movingTopicsMaxPosts" type="number" min="0" class="form-control" data-field="movingTopicsMaxPosts" placeholder="5">',
				'<p class="form-text">[[moving-topics:admin.settings.max-posts-help]]</p>',
				'</div>',
				'</div>',
			].join('');

			const container = $('#spy-container');
			if (!container.length) {
				return;
			}

			translator.translate(sectionHtml, function (translated) {
				container.append(translated);
				if (!app.config.hasOwnProperty('movingTopicsMaxPosts')) {
					$('#movingTopicsMaxPosts').val(5);
				} else {
					$('#movingTopicsMaxPosts').val(app.config.movingTopicsMaxPosts);
				}
			});
		});
	});
});
