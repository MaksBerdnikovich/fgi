(function ($) {

    'use strict';

    const functions = {
        init: () => {
            functions.mobileToggle();
            functions.balanceToggle();
            functions.scrollToTop();
            functions.tabs();
            functions.accordion();
            functions.dropdown();
            functions.toggler();
            functions.datepicker();
            try {
                functions.charts();
            } catch (e) {}
            functions.sliders();
            functions.contactForm();
            functions.loginForm();
            functions.forgotPassword();
            functions.registrationForm();
            functions.modals();
            functions.countdown();
            functions.depositCalc();
            functions.timer();
            functions.common();
            functions.onResize();
        },

        mobileToggle: () => {
            const $body = $('body')
            const $toggle = $('[data-menu-toggle]')
            const $nav = $('[data-menu-nav]')

            $toggle.on('click', () => {
                $body.toggleClass('lock')
                $toggle.toggleClass('open')
                $nav.toggleClass('open')
            })
        },

        balanceToggle: () => {
            const $body = $('.main-content')
            const $toggle = $('[data-balance-toggle]')
            const $balance = $('[data-balance]')

            $toggle.on('click', () => {
                $body.toggleClass('lock')
                $toggle.toggleClass('open')
                $balance.toggleClass('open')
            })
        },

        scrollToTop: () => {
            const offset = 500;
            const $button = $('[data-scroll-to-top]');

            $(window).scroll(function () {
                if ($(this).scrollTop() > offset) {
                    $button.addClass('show');
                } else {
                    $button.removeClass('show');
                }
            });

            $button.on('click', () => {
                $('html, body').animate({scrollTop: 0}, 400);
                return false;
            });
        },

        tabs: () => {
            const $tabs = $('[data-tab]');

            $tabs.each((i, $tab) => {
                const $body = $('[data-tab-body]', $tab);
                const $nav = $('[data-tab-nav]', $tab);

                $body.hide().filter(':first').show();

                $nav.on('click', function(e) {
                    e.preventDefault()

                    $body.hide();
                    $body.filter(this.hash).show();
                    $nav.removeClass('active');
                    $(this).addClass('active');
                    return false;
                }).filter(':first').click();
            })
        },
        
        accordion: () => {
            const $acc = $('[data-acc-body]');
            const $nav = $('[data-acc-nav]');

            $acc.hide().filter(':first').show();

            $nav.on('click', function(e) {
                e.preventDefault()

                $acc.hide();
                $acc.filter(this.hash).show();
                $nav.removeClass('active');
                $(this).addClass('active');
                return false;
            }).filter(':first').click();
        },

        dropdown: () => {
            $('[data-dropdown-toggle]').on('click', function() {
                $(this).toggleClass('open')
                $(this).next('[data-dropdown]').slideToggle(200);
            });

            $(document).click(function(e) {
                const target = e.target;
                if (!$(target).is('[data-dropdown-toggle]') && !$(target).parents().is('[data-dropdown-toggle]')) {
                    $('[data-dropdown-toggle]').removeClass('open');
                    $('[data-dropdown]').slideUp(200);
                }
            });
        },

        toggler: () => {
            $('[data-toggle]').on('click', function() {
                $(this).next('[data-toggle-target]').toggle();
                $(this).toggleClass('active');
            });
        },

        datepicker: () => {
            try {
                const picker = document.querySelector('[data-datepicker]');
                const datepicker = new Datepicker(picker);
            } catch (e){}

            try {
                const range = document.querySelector('[data-datepicker-range]');
                const rangepicker = new DateRangePicker(range);
            } catch (e){}
        },

        charts: () => {
            Chart.defaults.animation = false
            Chart.defaults.backgroundColor = 'transparent'
            Chart.defaults.borderColor = '#dbdbdb'
            Chart.defaults.color = '#333333'
            Chart.defaults.plugins.title.display = false
            Chart.defaults.plugins.legend.display = false

            Chart.defaults.font.family = 'Mont'
            Chart.defaults.font.size = 10
            Chart.defaults.scale.grid.lineWidth = 0.5
            Chart.defaults.scale.grid.tickLength = 10

            //console.log(Chart.defaults)

            const getDate = (timestamp) => {
                const d = new Date(timestamp * 1000)
                const utc = new Date(d.getTime() + (d.getTimezoneOffset() * 60000))
                const day = utc.getDate() < 10 ? '0' + utc.getDate() : utc.getDate()
                const month = utc.getMonth() + 1
                const year = utc.getFullYear().toString().substr(-2)

                return `${day}.${month}.${year}`
            }

            /*
                Home -> Graph of Indicators
            */
            const barCharts = document.querySelectorAll('[data-chart="barChart"]');
            barCharts.forEach((bar, i) => {
                const data = bar.getAttribute('data-data').split(',')
                const labels = bar.getAttribute('data-labels').split(',')

                const barChart = new Chart(bar, {
                    type: 'bar',
                    data: {
                        //labels: ['Wheat USA', 'Oil USA', 'Coffee USA', 'Oil WTI', 'Silver', 'Natural Gas', 'Fuel Oil', 'Cotton USA', 'Copper', 'Platinum', 'Gold', 'Sugar London'],
                        labels: labels,
                        datasets: [{
                            //data: [5.5, 5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1, 0.5, -1],
                            data: data,
                            backgroundColor: (context) => {
                                const value = context.dataset.data[context.dataIndex];
                                return value > 0 ? '#8acf1e' : '#ffc813';
                            },
                        }]
                    },
                    options: {
                        plugins: {
                            tooltip: {
                                enabled: false
                            }
                        },
                        scales: {
                            y: {
                                ticks: {
                                    font: {size: 15},
                                    callback: (value, index, ticks) => value + '%'
                                }
                            }
                        }
                    },

                });
            })

            /*
                Home -> Main Indicators
                Home -> Commodity Forward Rates
            */
            const lineCharts = document.querySelectorAll('[data-chart="lineChart"]');
            lineCharts.forEach((line, i) => {
                //get labels
                const points = []
                const data = line.getAttribute('data-data').slice(1, -1).split(',')
                data.forEach(point => points.push(parseFloat(point)))
                //get data
                const dates = []
                const labels = line.getAttribute('data-labels').slice(1, -1).split(',')
                labels.forEach((timestamp) => {
                    dates.push(getDate(parseInt(timestamp.slice(1, -1))))
                })
                //set start/end dates
                const startDate = getDate(parseInt(labels[0].slice(1, -1)))
                const endDate = getDate(parseInt(labels[labels.length - 1].slice(1, -1)))
                $(line).next().html(`<li>${startDate}</li><li>${endDate}</li>`)

                const lineChart = new Chart(line, {
                    type: 'line',
                    data: {
                        //labels: ['01.08.22', '02.08.22', '03.08.22', '04.08.22', '05.08.22', '06.09.22', '07.08.22', '08.08.22', '09.08.22', '10.08.22'],
                        labels: dates,
                        datasets: [{
                            //data: [6.02, 6.33, 6, 6.89, 6.51, 7, 6.99, 6.56, 6.03, 6.65],
                            data: points,
                            borderWidth: 1,
                            borderColor: '#ffc813',
                            pointBorderWidth: 1,
                            pointBorderColor: '#8acf1e',
                        }]
                    },
                    options: {
                        plugins: {
                            tooltip: {
                                enabled: false
                            }
                        },
                        scales: {
                            x: {
                                ticks: {
                                    callback: (value, index, ticks) => ''
                                }
                            },
                            y: {
                                ticks: {
                                    stepSize: 10,
                                    font: {size: 12},
                                    callback: (value, index, ticks) => value.toFixed(2)
                                }
                            }
                        }
                    },

                });
            })
        },

        sliders: () => {
            $('[data-reviews-slider]').owlCarousel({
                items: 1,
                margin: 0,
                autoHeight: true,
                loop: true,
                nav: true,
                dots: false,
            });

            $('[data-deposit-slider]').owlCarousel({
                margin: 0,
                autoHeight: true,
                mouseDrag: false,
                loop: false,
                nav: true,
                dots: false,
                responsive:{
                    0 : {
                        items: 1,
                    },
                    640 : {
                        items: 2
                    },
                    1700 : {
                        items: 4
                    }
                }
            });
        },

        contactForm: () => {
            const $form = $('#contactForm');
            const $name = $('input[name="name"]');
            const $email = $('input[name="email"]');
            const $message = $('textarea[name="message"]');

            let requared = false;
            const error = ($el) => {
                requared = false;
                $el.parents('.form-line').addClass('error');
            }
            const valid = ($el) => {
                requared = true;
                $el.parents('.form-line').removeClass('error');
            }

            $form.on('click', 'button', (e) => {
                e.preventDefault()

                // check name
                validator.isEmpty($name.val()) ? error($name) : valid($name);

                // check email
                !validator.isEmail($email.val()) ? error($email) : valid($email);

                // check message
                validator.isEmpty($message.val()) ? error($message) : valid($message);

                if (requared) return true;

                return false;
            })
        },

        loginForm: () => {
            const $form = $('#loginForm');
            const $login = $('input[name="username"]', $form);
            const $password = $('input[name="password"]', $form);

            const error = ($el) => {
                $el.attr('required');
                $el.parents('.form-line').addClass('error');
            }
            const valid = ($el) => {
                $el.removeAttr('required');
                $el.parents('.form-line').removeClass('error');
            }

            $form.on('click', 'button', (e) => {
                e.preventDefault()

                // check login
                validator.isEmpty($login.val()) ? error($login) : valid($login);

                // check password
                !validator.isStrongPassword($password.val()) ? error($password) : valid($password);

                let required = 0
                $('input', $form).each((i, el) => {
                    if ($(el).attr('required')) required++
                })

                if (required === 0) $form.submit()

                return false;
            })
        },

        forgotPassword: () => {
            const $form = $('#forgotPassword');
            const $email = $('input[name="email"]', $form);

            const error = ($el) => {
                $el.attr('required');
                $el.parents('.form-line').addClass('error');
            }
            const valid = ($el) => {
                $el.removeAttr('required');
                $el.parents('.form-line').removeClass('error');
            }

            $form.on('click', 'button', (e) => {
                e.preventDefault()

                // check email
                !validator.isEmail($email.val()) ? error($email) : valid($email);

                let required = 0
                $('input', $form).each((i, el) => {
                    if ($(el).attr('required')) required++
                })

                if (required === 0) $form.submit()

                return false;
            })
        },

        registrationForm: () => {
            const $form = $('#registrationForm');
            const $name = $('input[name="username"]', $form);
            const $surname = $('input[name="fullname"]', $form);
            const $email = $('input[name="email"]', $form);
            const $password = $('input[name="password"]', $form);
            const $passwordRepeat = $('input[name="password_repeat"]', $form);
            const $agrees = $('input[name="agrees"]', $form);

            const error = ($el) => {
                $el.attr('required');
                $el.parents('.form-line').addClass('error');
            }

            const valid = ($el) => {
                $el.removeAttr('required');
                $el.parents('.form-line').removeClass('error');
            }

            $form.on('click', 'button', (e) => {
                e.preventDefault()

                // check name
                validator.isEmpty($name.val()) ? error($name) : valid($name);

                // check surname
                validator.isEmpty($surname.val()) ? error($surname) : valid($surname);

                // check email
                !validator.isEmail($email.val()) ? error($email) : valid($email);

                // check password
                !validator.isStrongPassword($password.val()) ? error($password) : valid($password);
                !validator.isStrongPassword($passwordRepeat.val()) || ($passwordRepeat.val() !== $password.val()) ? error($passwordRepeat) : valid($passwordRepeat);

                // check agrees
                !$agrees.is(':checked') ? error($agrees) : valid($agrees)

                let required = 0
                $('input', $form).each((i, el) => {
                    if ($(el).attr('required')) required++
                })

                if (required === 0) {
                    Fancybox.show([{src: `#modalSuccess`}])
                    $('input', $form).each((i, el) => {
                        $(el).val('').prop('checked', false)
                    })
                }

                return false
            })
        },

        modals: () => {
            const $modal = $('[data-modal]')
            const $openModal = $('[data-modal-opened]')
            const id = $openModal.attr('id')

            if ($openModal.length > 0) {
                Fancybox.show([{ src: `#${id}`, type: "inline" }]);
            }

            $modal.on('click', '[data-modal-close]', function(e) {
                Fancybox.close();
            });
        },

        countdown: () => {
            let $countdown1 = $('.cb-countdown1');
            let $countdown2 = $('.cb-countdown2');

            $('[data-countdown-1]').each(function (i, item){
                let time = $(item).data('time');
                let timer = new Date().getTime() + parseInt(time)*60*60000;

                $(item).countdown(timer).on('update.countdown', function(event) {
                    $(this).html(event.strftime(
                        `<li>%H</li><li class="sep">:</li><li>%M</li><li class="sep">:</li><li>%S</li>`
                    ));
                });
            });

            $('[data-countdown-2]').each(function (i, item){
                let time = $(item).data('time');
                let timer = new Date().getTime() + parseInt(time)*60*60000;

                $(item).countdown(timer).on('update.countdown', function(event) {
                    $(this).html(event.strftime(`%H : %M : %S`));
                });
            });
        },

        timer: () => {
            let m
            const timer = function () {
                let now = new Date($(this).attr('data-now')),
                    startTime = new Date($(this).attr('data-start')),
                    finishTime = new Date($(this).attr('data-end')),
                    startMS = startTime.getTime(),
                    finishMS = finishTime.getTime(),
                    nowMS = now.getTime(),
                    betweenMS = finishMS - startMS,
                    lastMS = finishMS - nowMS,
                    percent = lastMS * 100 / betweenMS,
                    lastHour,
                    lastMin,
                    lastSec;
                percent = 100 - percent.toFixed();

                if ($(this).siblings(".valueInvest")) {
                    $(this).siblings(".valueInvest").find("[class='val']").attr('data-pr', percent);
                    $(this).siblings(".valueInvest").find("[class='val']").text(percent + ' %');

                    let pr = $(this).siblings(".valueInvest").find("[class='val']").attr("data-pr")
                    let prog = $(this).siblings(".valueInvest").find(".prog")
                    let cubePr = ((16 / 100) * pr)
                    cubePr = cubePr.toFixed();
                    for (let i = 0; i < cubePr; i++) {
                        prog.find(".cube").eq(i).addClass("open")
                    }

                }
                if ($(this).siblings(".circleBl")) {
                    $(this).siblings(".circleBl").find("input").attr('value', percent);
                    $(this).siblings(".circleBl").find("input").val(percent).trigger('change');
                }

                m = setInterval(function () {
                    nowMS = nowMS + 1000;
                    lastMS = finishMS - nowMS;

                    lastHour = Math.floor(lastMS / 1000 / 60 / 60)
                    lastMin = Math.floor((lastMS - (lastHour * 1000 * 60 * 60)) / 1000 / 60)
                    lastSec = Math.floor((lastMS - (lastHour * 1000 * 60 * 60) - (lastMin * 60 * 1000)) / 1000)

                    lastHour = checkTime(lastHour);
                    lastMin = checkTime(lastMin);
                    lastSec = checkTime(lastSec);

                    $(this).find('.hous').text(lastHour);
                    $(this).find('.min').text(lastMin);
                    $(this).find('.sec').text(lastSec);

                    if (lastMS / 1000 < 0) {
                        $(this).find('.hous').text('00');
                        $(this).find('.min').text('00');
                        $(this).find('.sec').text('00');
                    }

                }.bind(this), 1000)
            }

            const checkTime = function (i) {
                if (i < 10) {
                    i = "0" + i;
                }
                return i;
            }

            if ($(".timer").length > 0) {
                $(".timer").map(timer)
            }
        },

        depositCalc: () => {
            const $switcher = $('[data-switcher]');
            const $plans = $('[data-deposit-slider]');
            const $amount = $('[data-amount]');
            const $form = $('#openDeposit');

            const calculate = (
                planPercent = $('input[name="plan"]:checked').data('percent'),
                planImg = $('input[name="plan"]:checked').data('img'),
                planName = $('input[name="plan"]:checked').data('name'),
                planPeriod = $('input[name="plan"]:checked').data('period')
            ) => {
                const $depAmount = $('[data-dep-amount]');
                const $dailyProfit = $('[data-daily-profit]');
                const $totalProfit = $('[data-total-profit]');
                const $balance = $('[data-available-balance]');
                const amountVal = parseFloat($amount.val());

                let daily = amountVal / 100 * planPercent
                let total = daily * 30
                let balance = $('[data-select-deposit]').children('option:selected').data('balance');
                let currency = $('[data-select-deposit]').val();

                // switch payment method
                if ($('input[name="switch"]:checked').val() === 'balance') {
                    $('.deposit__shield > .select-group').hide()
                    balance = 1000
                    currency = '$'
                } else {
                    $('.deposit__shield > .select-group').show()
                }

                // change plan info
                $('[data-dep-plan-img]').attr('src', `dist/images/icons/${planImg}.svg`)
                $('[data-dep-plan-name]').html(planName)
                $('[data-dep-plan-perc]').html(`${planPercent}% per day`)
                $('[data-dep-plan-period]').html(`for ${planPeriod} months`)

                // change results info
                $balance.html((!isNaN(balance) ? balance.toFixed(2) : '0.00') + ` <sup>${currency.toUpperCase()}</sup>`);
                $depAmount.html((!isNaN(amountVal) ? amountVal.toFixed(2) : '0.00') + ` <sup>${currency.toUpperCase()}</sup>`);
                $dailyProfit.html((!isNaN(daily) ? daily.toFixed(2) : '0.00') + ` <sup>${currency.toUpperCase()}</sup>`);
                $totalProfit.html((!isNaN(total) ? total.toFixed(2) : '0.00') + ` <sup>${currency.toUpperCase()}</sup>`);
            }

            // calculate
            try {
                calculate()
            } catch (e){}

            // change plan info
            $('input[type="radio"]', $plans).on('change', () => calculate())

            // switch payment method
            $('input[type="radio"]', $switcher).on('change', () => calculate())

            // change payments system
            $('[data-select-deposit]').on('change', () => calculate())

            // amount keyup
            $amount.on('keyup', () => {
                calculate()
                $amount.removeClass('error').next('.error-text').hide()
            });

            // check form
            $form.on('submit', (e) => {
                const valid = !validator.isEmpty($amount.val())

                if (valid) {
                    return true
                } else {
                    $amount.addClass('error').next('.error-text').show()
                }

                return false
            });
        },

        common: () => {
            // selectric.js
            try {
                $('[data-select]').selectric();

                $('[data-select-custom]').selectric({
                    optionsItemBuilder: function(itemData, element, index) {
                        return `<img src="dist/images/pays/${itemData.value}.png" alt="${itemData.text}"/>
                                <span>1 ${itemData.value} ${itemData.text}</span>`
                    },
                    labelBuilder: function(currItem) {
                        return `<i><img src="dist/images/pays/${currItem.value}.png" alt="${currItem.text}"/></i> 
                                <span>1 ${currItem.value} <span class="title-h4 light">${currItem.text}</span></span>`
                    },
                });

                $('[data-select-deposit]').selectric({
                    optionsItemBuilder: function(itemData, element, index) {
                        return `<img src="dist/images/pays/${itemData.value}.png" alt="${itemData.text}"/>
                                <span>${itemData.text}</span>`
                    },
                    labelBuilder: function(currItem) {
                        return `<i><img src="dist/images/pays/${currItem.value}.png" alt="${currItem.text}"/></i>
                                <span class="title-h6">${currItem.text}</span></div>`
                    },
                });

            } catch (e){}

            // clipboard.js
            try {
                const clipboard = new ClipboardJS('[data-clipboard]');

                clipboard.on('success', function (e) {
                    const id = e.trigger.getAttribute('data-clipboard-target');
                    id ? $(id).select() : $(e).select()

                    $('[data-clipboard-confirm]').show()
                    setTimeout(() => $('[data-clipboard-confirm]').hide(), 2000)
                });
            } catch (e){}

            // fancybox.js
            Fancybox.bind("[data-fancybox]", {
                Html: {
                    video: {
                        autoplay: true,
                    }
                },
            })

            try {
                $('input[type=file]').on('change', function(){
                    const file = this.files[0];
                    $(this).closest('.file-group').find('.file-group__txt').html(file.name);
                });
            } catch (e){}
        },

        onResize: () => {
            window.addEventListener("resize", function () {
            }, false);
        },
    };

    // Run the function
    $(function () {
        functions.init();
    });
})(jQuery);