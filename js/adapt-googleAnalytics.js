define([ "coreJS/adapt" ], function(Adapt) {

	function onViewReady(view) {
		var title = view.model.get("title");

		ga("set", {
			page: location.pathname + location.search + location.hash,
			title: title
		});

		ga("send", "pageview");

		if (!Adapt.config.get("_googleAnalytics")._isDebugMode) return;

		Adapt.trigger("notify:push", {
			title: new Date().toLocaleTimeString() + " Google Analytics pageview:",
			body: title,
			_timeout: 2500
		});
	}

	function onDrawerToggle() {
		trackEvent("Interactions", "Pop-up", "Drawer");
	}

	function onDrawerTriggerCustomView($element) {
		if ($element.hasClass("page-level-progress")) {
			trackEvent("Interactions", "Pop-up", "Page Level Progress");
		}
		if ($element.hasClass("resources")) {
			trackEvent("Interactions", "Pop-up", "Resources");
		}
	}

	function onNotifyPopUp(data) {
		if (data._classes) return;

		var title = data.title;

		if (title) trackEvent("Interactions", "Pop-up", title);
	}

	function onPopUpOpened($element) {
		var id = $element.closest("[data-adapt-id]").data("adaptId");

		if (id) trackEvent("Interactions", "Pop-up", Adapt.findById(id).get("title"));
	}

	function onShowFeedback(view) {
		trackEvent("Interactions", "Pop-up", view.model.get("title"));
	}

	function onIsMediaPlayingChange(model, isMediaPlaying) {
		isMediaPlaying ? onMediaPlay(model) : onMediaPause(model);
	}

	function onMediaPlay(model) {
		trackEvent("Videos", "Play", model.get("title"));
	}

	function onMediaPause(model) {
		var video = $("." + model.get("_id")).find("video")[0];
		var duration = video ? video.duration : 0;

		if (!duration) return;

		var percentage = parseInt(video.currentTime / duration * 100, 10);

		trackEvent("Videos", "Percentage seen", model.get("title"), percentage);
	}

	function trackEvent(category, action, label, value, isNonInteraction) {
		var event = {
			hitType: "event",
			eventCategory: category,
			eventAction: action,
			eventLabel: label
		};

		if (value !== undefined) event.eventValue = value;
		if (isNonInteraction) event.nonInteraction = isNonInteraction;

		ga("send", event);

		if (!Adapt.config.get("_googleAnalytics")._isDebugMode) return;

		Adapt.trigger("notify:push", {
			title: new Date().toLocaleTimeString() + " Google Analytics event:",
			body: JSON.stringify(event, null, "\t"),
			_timeout: 2500
		});
	}

	Adapt.once("app:dataReady", function() {
		var config = Adapt.config.get("_googleAnalytics");

		if (!config || !config._isEnabled) return;

		var mediaModels = Adapt.components.where({ _component: "media" });

		$("head").append(Handlebars.templates.googleAnalytics(config));

		Adapt.on({
			"menuView:ready pageView:ready": onViewReady,
			"navigation:toggleDrawer": onDrawerToggle,
			"drawer:triggerCustomView": onDrawerTriggerCustomView, // plp, resources
			"notify:popup": onNotifyPopUp, // narrative
			"popup:opened": onPopUpOpened, // hot graphic
			"questionView:showFeedback": onShowFeedback
		});

		for (var i = 0, j = mediaModels.length; i < j; i++) {
			mediaModels[i].on("change:_isMediaPlaying", onIsMediaPlayingChange);
		}
	});

});