/*
 * Copyright (c) 2021 ib-themes
 * Author: ib-themes
 * This file is made for Barna
 */

(function ($) {
  "use strict";

  var BarnaInit = {
    init: function () {
      BarnaInit.magnific();
      BarnaInit.mainSlider();
      BarnaInit.BgImg();
      BarnaInit.imgToSVG();
      BarnaInit.progress();
      BarnaInit.portfolioFilter();
      BarnaInit.counter();
      BarnaInit.testimonials();
      BarnaInit.blog();
      BarnaInit.contactForm();
      BarnaInit.inputFocus();
      BarnaInit.headerFixer();
      BarnaInit.sectionTitleAnimation();
      BarnaInit.hamburger();
      BarnaInit.modal();
    },

    modal: function () {
      var self = this;
      var modalBox = $(".barna_modalbox");
      var item = $(".modal_item");
      var closePopup = modalBox.find(".close");
      var prevNext = modalBox.find(".barna_prevnext");
      var fixedTitle = modalBox.find(".fixed_title");

      item.on("click", function () {
        var element = $(this);
        var content = element.find(".hidden_information").html();

        var items = element.closest(".modal_items"),
          index = element.attr("data-index"),
          from = items.attr("data-from"),
          count = items.attr("data-count");
        prevNext.attr("data-index", index);
        prevNext.attr("data-from", from);
        var titleIndex = index < 10 ? "0" + index : index;
        var titleCount = count < 10 ? "0" + count : count;
        fixedTitle.html(
          "<span>" + titleIndex + "/" + titleCount + "</span>" + from
        );

        $("body").addClass("modal");
        modalBox.addClass("opened");
        modalBox.find(".modal_in").html(content);

        self.modal_prevnext(prevNext, modalBox);
        self.imgToSVG();
        self.BgImg();

        return false;
      });
      self.modal_prevnext(prevNext, modalBox);
      closePopup.on("click", function () {
        modalBox.removeClass("opened");
        modalBox.find(".modal_in").html("");
        $("body").removeClass("modal");
        return false;
      });
    },

    modal_prevnext: function (prevNext, modalBox) {
      var self = this;
      prevNext
        .find("a")
        .off()
        .on("click", function () {
          var e = $(this);
          var from = prevNext.attr("data-from");
          var index = parseInt(prevNext.attr("data-index"));
          var itemss = $('.modal_items[data-from="' + from + '"]');
          var count = parseInt(itemss.attr("data-count"));
          var fixedTitle = modalBox.find(".fixed_title");
          if (e.parent().hasClass("prev")) {
            index--;
          } else {
            index++;
          }
          if (index < 1) {
            index = count;
          }
          if (index > count) {
            index = 1;
          }

          var content = itemss
            .find('.modal_item[data-index="' + index + '"] .hidden_information')
            .html();
          prevNext.removeClass("disabled");
          prevNext.attr("data-index", index);

          setTimeout(function () {
            modalBox.find(".modal_in").fadeOut(500, function () {
              $(this).html(content).fadeIn(500);
            });
            var titleIndex = index < 10 ? "0" + index : index;
            var titleCount = count < 10 ? "0" + count : count;
            fixedTitle.html(
              "<span>" + titleIndex + "/" + titleCount + "</span>" + from
            );
          }, 500);

          $(".barna_modalbox .modal_content")
            .stop()
            .animate({ scrollTop: 0 }, 500, "swing");

          self.modal_prevnext(prevNext, modalBox);
          self.imgToSVG();
          self.BgImg();
          return false;
        });
    },

    hamburger: function () {
      $(".barna__mobile_header .hamb")
        .off()
        .on("click", function () {
          var element = $(this);
          var hamburger = element.find(".hamburger");
          var bottom = element
            .closest(".barna__mobile_header")
            .find(".header_bottom");
          if (hamburger.hasClass("is-active")) {
            hamburger.removeClass("is-active");
            bottom.slideUp();
          } else {
            hamburger.addClass("is-active");
            bottom.slideDown();
          }
          return false;
        });
    },

    sectionTitleAnimation: function () {
      var menu = $(".barna__section_title");
      var offset = 0;
      menu.each(function () {
        var element = $(this);
        var title = element.find(".title");
        if (!title.length) {
          return false;
        }
        $(window).on("scroll", function () {
          offset = $(window).scrollTop();
          var h = $(window).height();
          var i = element.offset().top - offset - h;
          if (i * -1 < h + 300 && i < 300) {
            if (element.hasClass("right")) {
              i = -i;
            }
            title.css({
              transform: "translate3d(" + (i * 80) / h + "px, 0px, 0px)",
            });
          }
        });
      });
    },

    headerFixer: function () {
      var menu = $("#header");
      var offset = $(window).scrollTop();
      BarnaInit.headerFix(menu, offset);

      $(window).on("scroll", function () {
        offset = $(window).scrollTop();
        BarnaInit.headerFix(menu, offset);
      });
    },

    headerFix: function (menu, offset) {
      if (offset >= 100) {
        menu.addClass("scrolled");
      } else {
        menu.removeClass("scrolled");
      }
    },

    inputFocus: function () {
      $(".barna__contact .item").each(function () {
        var e = $(this);
        var padding = 20;
        var input = e.find("input, textarea");
        if (input.val() === "") {
          e.removeClass("active");
        }
        input
          .on("focus", function () {
            e.addClass("active");
            input.css({
              paddingRight: e.find(".placeholder").outerWidth() + padding + 5,
            });
          })
          .on("blur", function () {
            if (input.val() === "") {
              e.removeClass("active");
              input.css({ paddingRight: padding + "px" });
            }
          });
      });
    },

    contactForm: function () {
      $("#send_message").on("click", function () {
        var form = $(".barna__contact");
        var name = form.find(".name").val();
        var subject = form.find(".subject").val();
        var email = form.find(".email").val();
        var message = form.find(".message").val();
        var spanSuccess = form.find(".success");
        var success = spanSuccess.data("success");
        var emailto = form.data("email");

        spanSuccess.empty(); //To empty previous error/success message.
        //checking for blank fields
        if (
          name === "" ||
          email === "" ||
          message === "" ||
          emailto === "" ||
          subject === ""
        ) {
          $(".empty_notice").slideDown(500).delay(2000).slideUp(500);
        } else {
          // Returns successful data submission message when the entered information is stored in database.
          $.post(
            "modal/contact.php",
            {
              ajax_name: name,
              ajax_email: email,
              ajax_subject: subject,
              ajax_emailto: emailto,
              ajax_message: message,
            },
            function (data) {
              spanSuccess.append(data); //Append returned message to message paragraph
              if (spanSuccess.find(".contact_error").length) {
                spanSuccess.slideDown(500).delay(2000).slideUp(500);
              } else {
                spanSuccess.append(
                  "<span class='contact_success'>" + success + "</span>"
                );
                spanSuccess.slideDown(500).delay(4000).slideUp(500);
              }
              if (data === "") {
                form[0].reset(); //To reset form fields on success
              }
            }
          );
        }
        return false;
      });
    },

    blog: function () {
      $(".barna__blog .owl-carousel").each(function () {
        var el = $(this);
        el.owlCarousel({
          autoplay: true,
          autoplayTimeout: 7000,
          smartSpeed: 1000,
          dots: true,
          loop: false,
          margin: 30,
          nav: false,
          items: 3,
          responsive: {
            0: { items: 1 },
            769: { items: 2 },
            1041: { items: 3 },
          },
        });
        el.on("changed.owl.carousel", function () {
          el.trigger("stop.owl.autoplay");
          el.trigger("play.owl.autoplay");
        });
      });
      BarnaInit.imgToSVG();
      BarnaInit.BgImg();
    },

    testimonials: function () {
      $(".barna__testimonials .owl-carousel").each(function () {
        var el = $(this);
        var parent = el.closest(".barna__testimonials");
        var items = el.find(".item");
        var count = items.length;
        var dots = parent.find(".my__dots");
        dots.find(".left").html('<span class="active"></span>');
        dots.find(".right").html("<span></span>".repeat(count - 1));
        items.each(function (i, e) {
          $(e).attr("data-index", i + 1);
        });
        el.owlCarousel({
          autoplay: true,
          autoplayTimeout: 7000,
          smartSpeed: 1000,
          loop: true,
          margin: 0,
          nav: false,
          items: 1,
          dots: false,
          onTranslated: function () {
            BarnaInit.reInitDots(
              dots,
              count,
              el.find(".active .item").attr("data-index")
            );
          },
        });
        el.on("changed.owl.carousel", function () {
          el.trigger("stop.owl.autoplay");
          el.trigger("play.owl.autoplay");
        });
      });
      BarnaInit.imgToSVG();
      BarnaInit.BgImg();
    },

    reInitDots: function (dots, count, index) {
      var left = dots.find(".left");
      var right = dots.find(".right");
      var leftSpan = left.children();
      var rightSpan = right.children();

      var leftLength = leftSpan.length;
      var rightLength = rightSpan.length;
      var leftOffset = index - leftLength;
      var rightOffset = count - index - rightLength;
      var time = 0;

      if (leftOffset === 0) {
        return false;
      }
      leftSpan.removeClass("active");

      if (leftOffset > 0) {
        left.append("<span></span>".repeat(leftOffset));
      } else {
        for (var i = 0; i < -leftOffset; i++) {
          BarnaInit.removeElement(leftSpan.eq(leftLength - 1 - i));
        }
        time = 301;
      }
      setTimeout(function () {
        left.children().last().addClass("active");
      }, time);

      if (rightOffset > 0) {
        right.append("<span></span>".repeat(rightOffset));
      } else {
        for (var a = 0; a < -rightOffset; a++) {
          BarnaInit.removeElement(rightSpan.eq(a));
        }
      }
    },

    removeElement: function (e) {
      e.css({ transform: "scale(0)" });
      setTimeout(function () {
        e.remove();
      }, 300);
    },

    counter: function () {
      $(".barna__counter").each(function () {
        var el = $(this);
        el.waypoint({
          handler: function () {
            if (!el.hasClass("done")) {
              el.addClass("done").countTo({
                refreshInterval: 50,
                formatter: function (value, options) {
                  return value
                    .toFixed(options.decimals)
                    .replace(/\B(?=(?:\d{3})+(?!\d))/g, ",");
                },
              });
            }
          },
          offset: "91%",
        });
      });
    },

    portfolioFilter: function () {
      if ($().isotope) {
        $(".barna__portfolio .list ul").isotope({
          filter: $(".barna__portfolio .filter .current").attr("data-filter"),
          animationOptions: {
            duration: 750,
            easing: "linear",
            queue: false,
          },
        });
        $(".barna__portfolio .filter a")
          .off()
          .on("click", function () {
            var element = $(this);
            var selector = element.attr("data-filter");
            var list = element.closest(".barna__portfolio").find(".list ul");
            list.isotope({
              filter: selector,
              animationOptions: {
                duration: 750,
                easing: "linear",
                queue: false,
              },
            });
            element.closest("li").siblings().find("a").removeClass("current");
            element.addClass("current");
            return false;
          });
      }
    },

    magnific: function () {
      $(".gallery_zoom").each(function () {
        // the containers for all your galleries
        var zoom = $(this);
        zoom.magnificPopup({
          delegate: ".zoom",
          type: "image",
          gallery: {
            enabled: true,
          },
          removalDelay: 300,
          mainClass: "mfp-fade",
        });
      });
    },

    progress: function () {
      $(".barna__progress").each(function () {
        var pWrap = $(this);
        pWrap.waypoint({
          handler: function () {
            BarnaInit.progressF(pWrap);
          },
          offset: "90%",
        });
      });
    },

    progressF: function (container) {
      container.find(".progress_item").each(function (i) {
        var progress = $(this);
        var value = parseInt(progress.data("value"));
        var percent = progress.find(".progress_percent");
        var pBar = progress.find(".progress_bg");
        pBar.css({ width: value + "%" });

        var speed = 3000 / value;
        for (var a = 0; a <= value; a++) {
          BarnaInit.progressP(percent, a, speed);
        }
        setTimeout(function () {
          progress.addClass("open");
        }, i * 500);
      });
    },
    progressP: function (percent, i, speed) {
      setTimeout(function () {
        percent.html(i + "%");
      }, speed * i);
    },

    mainSlider: function () {
      $(".barna__hero .owl-carousel").each(function () {
        var el = $(this);
        var parent = el.closest(".barna__hero");
        el.owlCarousel({
          autoplay: true,
          autoplayTimeout: 7000,
          smartSpeed: 1000,
          loop: true,
          margin: 0,
          nav: false,
          items: 1,
          dots: false,
        });
        var prev = parent.find(".my__nav .prev");
        var next = parent.find(".my__nav .next");
        prev.off().on("click", function () {
          el.trigger("prev.owl");
          return false;
        });
        next.off().on("click", function () {
          el.trigger("next.owl");
          return false;
        });
        el.on("changed.owl.carousel", function () {
          el.trigger("stop.owl.autoplay");
          el.trigger("play.owl.autoplay");
        });
      });
      BarnaInit.imgToSVG();
      BarnaInit.BgImg();
    },

    imgToSVG: function () {
      $("img.svg").each(function () {
        var img = $(this);
        var imgClass = img.attr("class");
        var imgURL = img.attr("src");

        $.get(
          imgURL,
          function (data) {
            var svg = $(data).find("svg");
            if (typeof imgClass !== "undefined") {
              svg = svg.attr("class", imgClass + " ready-svg");
            }
            img.replaceWith(svg);
          },
          "xml"
        );
      });
    },

    BgImg: function () {
      $("*[data-bg-img]").each(function () {
        var element = $(this);
        var attrBg = element.attr("data-bg-img");
        if (typeof attrBg !== "undefined" && attrBg !== "") {
          element.css({ backgroundImage: "url(" + attrBg + ")" });
        }
      });
    },

    myPreloader: function () {
      var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(
        navigator.userAgent
      )
        ? true
        : false;
      var preloader = $("#preloader");

      if (!isMobile) {
        setTimeout(function () {
          preloader.addClass("preloaded");
        }, 800);
        setTimeout(function () {
          preloader.remove();
        }, 2000);
      } else {
        preloader.remove();
      }
    },
  };

  $(document).ready(function () {
    BarnaInit.init();
  });

  $(window).on("resize", function () {});

  $(window).load("body", function () {
    setTimeout(function () {
      BarnaInit.portfolioFilter();
    }, 100);
    setTimeout(function () {
      BarnaInit.myPreloader();
    }, 500);
  });

  $(window).on("scroll", function () {});
})(jQuery);

jQuery(".nav ul,.barna__mobile_header .header_bottom ul").onePageNav();

// fixed top spacing issue
$(".header_bottom ul li a").click(function () {
  $("html, body").animate({
    scrollTop: $($.attr(this, "href")).offset().top - 80,
  });
  return false;
});
