# Google Analytics

An extension to facilitate [Google Analytics](https://developers.google.com/analytics) in Adapt.

## Installation

* Add the following to `config.json`:
```json
"_googleAnalytics": {
	"_isEnabled": true,
	"_trackingId": ""
}
```
* Populate `_trackingID` with the [tracking ID](https://support.google.com/analytics/answer/1032385) of your Google Analytics property.
* Copy the extension folder into the src > extensions directory and run an appropriate Grunt task.

### Usage

* Every time a menu or page is loaded, a `pageview` is recorded with a new URL and title.
* Pop-up interactions are tracked through custom events e.g. launching Notify, Drawer etc.
* [Media](https://github.com/adaptlearning/adapt-contrib-media) plays and percentage viewed are also tracked.

### Attributes

Attribute | Type | Description | Default
--------- | ---- | ----------- | -------
`_isEnabled` | Boolean | Enables Google Analytics tracking | `false`
`_isDebugMode` | Boolean | Displays notifications when pageviews and events are tracked | `false`
`_trackingId` | String | The tracking ID of the Google Analytics property to track, in the format `"UA-XXXXX-Y"` | `""`