import Adapt from 'core/js/adapt';

class GoogleAnalytics extends Backbone.Controller {

  initialize() {
    this.listenTo(Adapt, {
      'app:dataReady': this.onAppDataReady
    });
  }

  _setupListeners() {
    this.listenTo(Adapt, {
      'contentObjectView:ready': this.onContentObjectViewReady,
      'media': this.onMediaEvent,
      'googleAnalytics:trackEvent': this.onTrackEvent
    });
  }

  onAppDataReady() {
    this._config = Adapt.config.get('_googleAnalytics');

    if (!(this._config?._isEnabled)) return;

    this._setupListeners();

    $('head').append(Handlebars.templates.googleAnalytics(this._config));
  }

  onContentObjectViewReady(view) {
    gtag('event', 'page_view', {
      page_location: location.pathname + location.search + location.hash,
      page_title: view.model.get('title')
    });
  }

  onMediaEvent(attributes) {
    /*
    gtag('event', name, {
      event_action: ,
      event_category: ,
      event_label: ,
      value:
    });
    */

    switch(attributes.type) {
      case "play":
        gtag('event', 'video_start', {

        });
    }

    console.log(attributes);

    //gtag('event', name, attributes);
  }

  onTrackEvent(name, attributes) {
    /*
    gtag('event', name, {
      event_action: ,
      event_category: ,
      event_label: ,
      value:
    });
    */

    gtag('event', name, attributes);
  }

}

export default new GoogleAnalytics();
