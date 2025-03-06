(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.kloner = factory());
})(this, (function () { 'use strict';

  /*!
    Kloner v0.1.0 (https://kloner.js.org)
    by Five Fifteen (https://fivefifteen.com)
  */

  var _kloner = function kloner(containerSelector, childSelector, options) {
    if (childSelector && childSelector.constructor === Object) {
      options = childSelector;
      childSelector = null;
    }
    if (containerSelector && containerSelector.constructor === Object) {
      options = containerSelector;
      containerSelector = null;
    }
    options = Object.assign({}, _kloner.defaultOptions, options || {});
    if (containerSelector) {
      options.containerSelector = containerSelector;
    }
    if (childSelector) {
      options.childSelector = childSelector;
    }
    var containers = _kloner.getInstances(options.containerSelector);
    if (containers && containers.length) {
      for (var i = 0; i < containers.length; i++) {
        (function (container) {
          var funcs = {
            add: function add(atIndex, options) {
              return _kloner.add(container, atIndex, options);
            },
            remove: function remove(atIndex, options) {
              return _kloner.remove(container, atIndex, options);
            }
          };
          var opts = Object.assign({}, options, _kloner.getAttributeOptions(container), funcs);
          var data = {}; // eslint-disable-line prefer-const

          if (opts.template) {
            var templateContainer = document.createElement(null);
            templateContainer.innerHTML = opts.template;
            var templateElement = templateContainer.firstElementChild;
            var template = templateElement.cloneNode(true);
            data.template = template;
            data.templateIndex = 0;
            templateContainer.remove();
          } else {
            var _templateElement = container.querySelector(opts.childSelector);
            if (!_templateElement) {
              console.warn('[kloner] No template found:', opts.childSelector);
              return;
            }
            var _template = _templateElement.cloneNode(true);
            data.template = _template;
            data.templateIndex = Array.prototype.indexOf.call(container.children, _templateElement);
            if (_templateElement.matches('[data-kloner-template]')) {
              _templateElement.remove();
            }
          }
          var existingChildren = container.querySelectorAll(opts.childSelector);
          var count = existingChildren.length;
          for (var j = 0; j < count; j++) {
            _kloner.replaceParameters(existingChildren[j], Object.assign({}, opts.parameters || {}, {
              index: j,
              number: j + 1
            }));
          }
          data.count = count;
          data.constCount = count;
          container.kloner = opts;
          container.klonerData = data;
          _kloner.initializeTriggers(container);
          if (opts.start) {
            var extraChildren = opts.start;
            if (!Array.isArray(extraChildren) && Number.isInteger(parseInt(extraChildren))) {
              extraChildren = Array(parseInt(extraChildren) - container.klonerData.count || 0).fill({});
            }
            if (Array.isArray(extraChildren)) {
              extraChildren.forEach(function (childParameters) {
                opts.add(null, {
                  parameters: childParameters
                });
              });
            }
          }
          if (opts.min && container.klonerData.count < parseInt(opts.min)) {
            for (var k = 0; k < parseInt(opts.min) - container.klonerData.count; k++) {
              opts.add();
            }
          }
          if (opts.max && container.klonerData.count > parseInt(opts.max)) {
            for (var l = 0; l < container.klonerData.count - parseInt(opts.max); l++) {
              opts.remove();
            }
          }
        })(containers[i]);
      }
    }
    if (containers.length) {
      if (containers.length === 1) {
        return containers[0];
      }
      return containers;
    }
    return false;
  };
  _kloner.add = function (containerSelector, atIndex, options) {
    if (atIndex && atIndex.constructor === Object) {
      options = atIndex;
      atIndex = null;
    }
    if (containerSelector && containerSelector.constructor === Object) {
      options = containerSelector;
      containerSelector = null;
    }
    if (!containerSelector) containerSelector = _kloner.defaultOptions.containerSelector;
    var containers = _kloner.getInstances(containerSelector, true);
    if (containers && containers.length) {
      for (var i = 0; i < containers.length; i++) {
        (function (container, _ref) {
          var opts = Object.assign({}, container.kloner, _kloner.getAttributeOptions(container), options);
          var count = container.klonerData.count;
          var elementCount = opts.updateChildren ? count : container.klonerData.constCount;
          if (opts.max && count >= parseInt(opts.max)) {
            return;
          }
          var elements = container.querySelectorAll(opts.childSelector);
          var element = container.klonerData.template.cloneNode(true);
          _kloner.replaceParameters(element, Object.assign({}, opts.parameters || {}, {
            index: elementCount,
            number: elementCount + 1
          }));
          if (opts.beforeAdd && opts.beforeAdd(container, element, opts) === false) {
            return false;
          }
          var elementIndex = (_ref = atIndex !== null && atIndex !== void 0 ? atIndex : elements.length) !== null && _ref !== void 0 ? _ref : container.klonerData.templateIndex;
          if (elementIndex) {
            if (elementIndex >= container.children.length) {
              container.append(element);
            } else {
              container.insertBefore(element, container.children[elementIndex]);
            }
          } else {
            container.prepend(element);
          }
          container.klonerData.count++;
          container.klonerData.constCount++;
          if (opts.updateChildren) {
            _kloner.updateChildren(container);
          }
          _kloner.initializeTriggers(container);
          if (opts.afterAdd) {
            opts.afterAdd(container, element, opts);
          }
        })(containers[i]);
      }
    }
  };
  _kloner.defaultOptions = {
    afterAdd: null,
    afterChildUpdate: null,
    afterRemove: null,
    beforeAdd: null,
    beforeChildUpdate: null,
    beforeRemove: null,
    childSelector: '[data-kloner-template], :scope > *',
    containerSelector: '[data-kloner], .kloner',
    max: null,
    min: 0,
    parameters: null,
    start: 0,
    template: null,
    updateChildren: false
  };
  _kloner.getAttributeOptions = function (containerSelector) {
    if (!containerSelector) containerSelector = _kloner.defaultOptions.containerSelector;
    var container = _kloner.getInstances(containerSelector, false, true);
    if (container) {
      var data = Object.assign({}, container.dataset);
      var regexp = /kloner([A-Z].*)/;
      return Object.keys(data).filter(function (key) {
        return regexp.test(key);
      }).reduce(function (obj, key) {
        var match = key.match(regexp);
        var newKey = match[1][0].toLowerCase() + match[1].slice(1);
        obj[newKey] = data[key];
        return obj;
      }, {});
    }
    return {};
  };
  _kloner.getInstances = function (elements, verify, single) {
    if (typeof elements === 'string') {
      elements = document.querySelectorAll(elements);
    } else if (elements instanceof HTMLElement) {
      elements = [elements];
    }
    if (verify) {
      var verifiedElements = []; // eslint-disable-line prefer-const

      for (var i = 0; i < elements.length; i++) {
        (function (container) {
          if (!container.kloner) {
            console.warn('Element doesn\'t appear to be a kloner instance:', container);
            return;
          }
          verifiedElements.push(container);
        })(elements[i]);
      }
      return verifiedElements;
    }
    if (elements.length && single) {
      return elements[0];
    }
    return elements;
  };
  _kloner.initializeTriggers = function (containerSelector) {
    if (!containerSelector) containerSelector = _kloner.defaultOptions.containerSelector;
    var containers = _kloner.getInstances(containerSelector, true);
    if (containers && containers.length) {
      for (var i = 0; i < containers.length; i++) {
        (function (container) {
          var addElements = container.querySelectorAll('[data-kloner-add]');
          if (container.id) {
            addElements = Array.prototype.slice.call(addElements).concat(Array.prototype.slice.call(document.querySelectorAll('[data-kloner-add="' + container.id + '"]')));
          }
          if (addElements.length) {
            var _loop = function _loop(j) {
              if (!addElements[j].klonerData || !addElements[j].klonerData.trigger) {
                addElements[j].addEventListener('click', function (e) {
                  var atIndex = null;
                  if (!addElements[j].dataset.klonerAdd.length) {
                    var child = addElements[j].closest(container.kloner.childSelector);
                    if (child) {
                      atIndex = Array.prototype.indexOf.call(container.children, child);
                    }
                  }
                  container.kloner.add(atIndex, _kloner.getAttributeOptions(addElements[j]));
                });
                if (!addElements[j].klonerData) {
                  addElements[j].klonerData = {};
                }
                addElements[j].klonerData.trigger = true;
              }
            };
            for (var j = 0; j < addElements.length; j++) {
              _loop(j);
            }
          }
          var removeElements = container.querySelectorAll('[data-kloner-remove]');
          if (container.id) {
            removeElements = Array.prototype.slice.call(removeElements).concat(Array.prototype.slice.call(document.querySelectorAll('[data-kloner-remove="' + container.id + '"]')));
          }
          if (removeElements.length) {
            var _loop2 = function _loop2(k) {
              if (!removeElements[k].klonerData || !removeElements[k].klonerData.trigger) {
                removeElements[k].addEventListener('click', function (e) {
                  var atIndex = null;
                  if (!removeElements[k].dataset.klonerRemove.length) {
                    var child = removeElements[k].closest(container.kloner.childSelector);
                    if (child) {
                      atIndex = Array.prototype.indexOf.call(container.children, child);
                    }
                  }
                  container.kloner.remove(atIndex, _kloner.getAttributeOptions(removeElements[k]));
                });
                if (!removeElements[k].klonerData) {
                  removeElements[k].klonerData = {};
                }
                removeElements[k].klonerData.trigger = true;
              }
            };
            for (var k = 0; k < removeElements.length; k++) {
              _loop2(k);
            }
          }
          var countElements = container.querySelectorAll('[data-kloner-count]');
          if (container.id) {
            countElements = Array.prototype.slice.call(countElements).concat(Array.prototype.slice.call(document.querySelectorAll('[data-kloner-count="' + container.id + '"]')));
          }
          if (countElements.length) {
            for (var l = 0; l < countElements.length; l++) {
              countElements[l].textContent = container.klonerData.count;
            }
          }
        })(containers[i]);
      }
    }
  };
  _kloner.remove = function (containerSelector, atIndex, options) {
    if (atIndex && atIndex.constructor === Object) {
      options = atIndex;
      atIndex = null;
    }
    if (containerSelector && containerSelector.constructor === Object) {
      options = containerSelector;
      containerSelector = null;
    }
    if (!containerSelector) containerSelector = _kloner.defaultOptions.containerSelector;
    var containers = _kloner.getInstances(containerSelector, true);
    if (containers && containers.length) {
      for (var i = 0; i < containers.length; i++) {
        (function (container) {
          var opts = Object.assign({}, container.kloner, _kloner.getAttributeOptions(container), options);
          var count = container.klonerData.count;
          if (count <= 0 || opts.min && count <= parseInt(opts.min)) {
            return;
          }
          var elements = container.querySelectorAll(opts.childSelector);
          var indexLimit = elements.length - 1;
          var elementIndex = atIndex !== null && atIndex !== void 0 ? atIndex : indexLimit;
          if (elementIndex > indexLimit) {
            elementIndex = indexLimit;
          }
          var element = elements[elementIndex];
          if (opts.beforeRemove && opts.beforeRemove(container, element, opts) === false) {
            return false;
          }
          element.remove();
          container.klonerData.count--;
          if (opts.updateChildren) {
            _kloner.updateChildren(container);
          }
          _kloner.initializeTriggers(container);
          if (opts.afterRemove) {
            opts.afterRemove(container, element, opts);
          }
        })(containers[i]);
      }
    }
  };
  _kloner.replaceParameters = function (element, parameters) {
    if (!element.klonerData) {
      element.klonerData = {};
    }
    if (!element.klonerData.initialContent) {
      element.klonerData.initialContent = element.innerHTML;
    }
    element.klonerData.parameters = Object.assign({}, element.klonerData.parameters, parameters || {});
    element.innerHTML = element.klonerData.initialContent.replaceAll(/\{kloner-(\w+)\}/g, function (match, key) {
      var _element$klonerData$p;
      return (_element$klonerData$p = element.klonerData.parameters[key]) !== null && _element$klonerData$p !== void 0 ? _element$klonerData$p : match;
    });
  };
  _kloner.updateChildren = function (containerSelector) {
    if (!containerSelector) containerSelector = _kloner.defaultOptions.containerSelector;
    var containers = _kloner.getInstances(containerSelector, true);
    if (containers && containers.length) {
      for (var i = 0; i < containers.length; i++) {
        (function (container) {
          var opts = container.kloner;
          var elements = container.querySelectorAll(opts.childSelector);
          if (elements) {
            for (var j = 0; j < elements.length; j++) {
              var element = elements[j];
              if (opts.beforeChildUpdate && opts.beforeChildUpdate(container, element, opts) === false) {
                continue;
              }
              _kloner.replaceParameters(element, {
                index: j,
                number: j + 1
              });
              if (opts.afterChildUpdate) {
                opts.afterChildUpdate(container, element, opts);
              }
            }
          }
        })(containers[i]);
      }
    }
  };

  return _kloner;

}));
//# sourceMappingURL=kloner.js.map
