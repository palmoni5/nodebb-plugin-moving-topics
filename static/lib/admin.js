'use strict';

/* global ajaxify, app */

let inserted = false;

$(window).on('action:app.load', function () {
	require(['hooks', 'translator', 'admin/settings'], function (hooks, translator, Settings) {
		hooks.on('action:ajaxify.end', function () {
			if (!ajaxify.data || !ajaxify.data.template || !ajaxify.data.template['admin/settings/post']) {
				inserted = false;
				return;
			}

			const container = $('#spy-container');
			if (!container.length) {
				return;
			}

			if (inserted) {
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

			translator.translate(sectionHtml, function (translated) {
				container.append(translated);
				inserted = true;

				if (!app.config.hasOwnProperty('movingTopicsMaxPosts')) {
					$('#movingTopicsMaxPosts').val(5);
				} else {
					$('#movingTopicsMaxPosts').val(app.config.movingTopicsMaxPosts);
				}

				Settings.prepare();
			});
		});
	});
});
