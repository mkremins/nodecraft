function NonCancellableEvent() {
  this._monitors = [], this._observers = [];
}

NonCancellableEvent.prototype.addMonitor = function(handler, filter) {
  this._monitors.push({ shouldHandle: filter, notify: handler });
};

NonCancellableEvent.prototype.addObserver = function(handler, filter) {
  this._observers.push({ shouldHandle: filter, notify: handler });
};

NonCancellableEvent.prototype.fire = function(data) {
  this._monitors.forEach(function(monitor) {
    if (monitor.shouldHandle(data)) {
      monitor.notify(data);
    }
  });
  this._observers.forEach(function(observer) {
    if (observer.shouldHandle(data)) {
      observer.notify(data);
    }
  });
};

function CancellableEvent() {
  NonCancellableEvent.call(this);
  this._modifiers = [];
}

CancellableEvent.prototype = NonCancellableEvent.prototype;
CancellableEvent.prototype.constructor = CancellableEvent;

CancellableEvent.prototype.addModifier = function(handler, filter) {
  this._modifiers.push({ shouldHandle: filter, modify: handler });
};

CancellableEvent.prototype.fire = function(data) {
  this._monitors.forEach(function(monitor) {
    if (monitor.shouldHandle(data)) {
      monitor.notify(data);
    }
  });
  this._modifiers.forEach(function(modifier) {
    if (modifier.shouldHandle(data)) {
      data = modifier.modify(data);
    }
  });
  if (!data.consumed) {
    this._observers.forEach(function(observer) {
      if (observer.shouldHandle(data)) {
        observer.notify(data);
      }
    });
  }
};

var eventTypes = {
  chat:    new CancellableEvent(),
  command: new CancellableEvent(),
  join:    new CancellableEvent(),
  quit:    new NonCancellableEvent()
};

function noOpFilter() {
  return true;
}

function before(eventType, filter, handler) {
  var event = eventTypes[eventType];
  if (event.addMonitor) {
    if (typeof handler == 'undefined') {
      handler = filter;
      filter = noOpFilter;
    }
    event.addMonitor(handler, filter);
  } else {
    // TODO
  }
}

function on(eventType, filter, handler) {
  var event = eventTypes[eventType];
  if (event.addModifier) {
    if (typeof handler == 'undefined') {
      handler = filter;
      filter = noOpFilter;
    }
    event.addModifier(handler, filter);
  } else {
    // TODO
  }
}

function after(eventType, filter, handler) {
  var event = eventTypes[eventType];
  if (event.addObserver) {
    if (typeof handler == 'undefined') {
      handler = filter;
      filter = noOpFilter;
    }
    event.addObserver(handler, filter);
  } else {
    // TODO
  }
}

function fire(eventType, data) {
  eventTypes[eventType].fire(data);
}

module.exports = {
  before: before,
  on: on,
  after: after,
  fire: fire
};
