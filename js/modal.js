/**
 * @module neue/modal
 * Show/hide modals. To link to a modal, add a `data-modal-href` attribute
 * pointing to the selector for the modal you want to show.
 *
 * @example
 * // <a href="http://www.example.com" data-modal-href="#modal--example">Click!</a>
 * // <div data-modal id="modal--example" role="dialog">
 * //   <!-- content -->
 * // </div>
 *
 */

define(function(require) {
  "use strict";

  var $ = window.jQuery;
  var Modernizr = window.Modernizr;
  var Events = require("./events");

  // Cache commonly used jQuery objects
  var $document = $(document);
  var $chrome = $(".chrome");
  var $modalContainer = null;

  // UI elements:
  var $skipLink = $("<a href='#' class='js-close-modal js-modal-generated modal-close-button -alt'>skip</a>");
  var $closeLink = $("<a href='#' class='js-close-modal js-modal-generated modal-close-button'>&#215;</a>");

  // The currently open modal
  var $modal = null;

  // We can only have one modal open at a time; we track that here.
  var modalIsOpen = false;

  // Whether this modal can be closed by the user
  var closeable = false;

  // Return a boolean if modal is open or not
  var isOpen = function() {
    return modalIsOpen;
  };

  /**
   * Open a new modal
   * @param {jQuery}  $el                 Element that will be placed inside the modal.
   * @param {boolean} [options.animated=true]     Use animation for opening the modal.
   * @param {boolean} [options.closeButton]       Override `data-modal-close` attribute.
   * @param {boolean} [options.skipForm]          Override `data-modal-skip-form` attribute.
   */
  var open = function($el, options) {
    options = options || {};
    options.animated = typeof options.animated !== "undefined" ? options.animated : true;
    options.closeButton = typeof options.closeButton !== "undefined" ? options.closeButton : $el.attr("data-modal-close");
    options.skipForm = typeof options.skipForm !== "undefined" ? options.skipForm : $el.attr("data-modal-skip-form");

    // Read from DOM
    var offsetTop = "-" + $document.scrollTop() + "px";

    // We add a "close" button programmatically
    // @param [data-modal-close=true]
    switch (options.closeButton) {
      case "skip":
        // Add a skip button, which delegates to the submitting the form with the given ID
        $el.prepend( $skipLink );
        $skipLink.on("click", function(event) {
          event.preventDefault();
          $(options.skipForm).submit();
        });
        closeable = false;
        break;

      case "false":
      case "0":
        closeable = false;
        break;

      default:
        $el.prepend($closeLink);
        closeable = true;
    }

    if(!modalIsOpen) {
      // Set up overlay and show modal
      $chrome.addClass("modal-open");
      $chrome.css("top", offsetTop);
      $el.css("display", "block");
      $modalContainer.css("display", "block");
      if(options.animated && Modernizr.cssanimations) {
        $modalContainer.addClass("animated-open");
      }
    } else {
      // Modal is already open, so just replace current content
      $modal.hide();
      $el.show();
    }

    // Make sure we're scrolled to the top of the modal.
    $document.scrollTop(0);

    // We provide an event that other modules can hook into to perform custom functionality when
    // a modal opens (such as preparing things that are added to the DOM, etc.)
    Events.publish("Modal:opened", $el);

    // Keep track of whether modal is open or not
    $modal = $el;
    modalIsOpen = true;
  };

  // Cleanup after modal animates out
  var _cleanup = function(scrollOffset) {
    $modalContainer.css("display", "none");
    $modalContainer.removeClass("animated-close");
    $modal.css("display", "none");

    // Remove any generated content
    $modal.find(".js-modal-generated").remove();

    // Remove overlay and reset scroll position
    $chrome.removeClass("modal-open");
    $chrome.css("top", "");
    $document.scrollTop(scrollOffset);
  };

  /**
   * Close the active modal.
   * @param {boolean} [options.animated=true] Use animation for closing the modal.
   */
  var close = function(options) {
    options = options || {};
    options.animated = typeof options.animated !== "undefined" ? options.animated : true;

    var scrollOffset = parseInt($chrome.css("top")) * -1;

    if(options.animated && Modernizr.cssanimations) {
      $modalContainer.addClass("animated-close");
      $modalContainer.one("webkitAnimationEnd oanimationend msAnimationEnd animationend", function() {
        _cleanup(scrollOffset);
      });
    } else {
      _cleanup(scrollOffset);
    }

    // Remove URL hash for modal from browser
    if(window.location.hash === "#" + $modal.attr("id")) {
      window.location.hash = "/";
    }

    // We provide an event that other modules can hook into to perform custom functionality when
    // a modal opens (such as preparing things that are added to the DOM, etc.)
    Events.publish("Modal:Close", $modal);

    // Keep track of whether modal is open or not
    modalIsOpen = false;
  };

  // Click handler for opening a new modal
  var _openHandler = function(event) {
    event.preventDefault();
    var href = $(this).data("modal-href");

    open($(href));
  };

  // Click handler for closing a modal
  var _closeHandler = function(event) {
    // Don't let the event bubble.
    if(event.target !== this) {
      return;
    }

    // Only close on clicking overlay if this modal has a "x" close button
    if( $(this).hasClass("js-close-modal") || closeable ) {
      // Override default link behavior.
      event.preventDefault();
      close();
    }
  };

  $document.ready(function() {
    var $body = $("body");

    // Create container for modals
    $modalContainer = $("<div class='modal-container'></div>");
    $body.append($modalContainer);

    // Prepare the DOM!
    $("[data-modal]").each(function() {
      $(this).appendTo($modalContainer);
      $(this).attr("hidden", true);
    });

    //If there's a hash in the URL, check if it's a modal and load it
    var hash = window.location.hash;
    if(hash && hash !== "#/" && $(hash) && typeof $(hash).data("modal") !== "undefined") {
      open($(hash));
    }

    // Bind events to open & close modal
    $body.on("click", "[data-modal-href]", _openHandler);
    $body.on("click", ".modal-container", _closeHandler);
    $body.on("click", ".js-close-modal", _closeHandler);
  });


  // Return public API for controlling modals
  return {
    isOpen: isOpen,
    open: open,
    close: close
  };
});
