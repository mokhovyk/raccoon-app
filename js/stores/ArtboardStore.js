var MinceAppDispatcher = require('../dispatcher/MinceAppDispatcher');
var MinceConstants = require('../constants/MinceConstants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var ActionTypes = MinceConstants.ActionTypes;
var CHANGE_EVENT = 'change';

var _artboard = {};
var _currentID = null;

var ArtboardStore = assign({}, EventEmitter.prototype, {

    init: function(project) {
        _artboard = project.artboard ;

        if (!_currentID) {
            for(var key in _artboard) {
                _currentID = _artboard[key].id;
                break;
            }
        }
    },

    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    /**
    * @param {function} callback
    */
    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    /**
    * @param {function} callback
    */
    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

    /**
    * @param {string} id
    */
    get: function(id) {
        return _artboard[id];
    },

    getCurrentID: function() {
        return _currentID;
    },

    getCurrent: function() {
        return this.get(this.getCurrentID());
    },

    getLayer: function() {
        return this.getCurrent().layer;
    }

});

ArtboardStore.dispatchToken = MinceAppDispatcher.register(function(action) {
    switch(action.type) {
        case ActionTypes.CLICK_NAV_ARTBOARD:
            _currentID = action.artboardID;
            ArtboardStore.emitChange();
            break;

        case ActionTypes.RECEIVE_PROJECT:
            ArtboardStore.init(action.project);
            ArtboardStore.emitChange();
            break;

        default:
        // do nothing
    }
});

module.exports = ArtboardStore;
