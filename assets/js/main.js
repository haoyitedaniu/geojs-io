document.addEventListener('DOMContentLoaded', () => {
  // Get burger element and his data-target menu
  const burger = document.querySelector('.navbar-burger');
  const menu = document.getElementById(burger.dataset.target);

  burger.addEventListener('click', () => {
    // Toggle burger icon to cross
    burger.classList.toggle('is-active');
    // Toggle menu visibility on touch device
    menu.classList.toggle('is-active');
  });

  menu.addEventListener('click', () => {
    // Hide menu after tap on touch device
    if (window.getComputedStyle(burger).display == 'block') {
      burger.click();
    }
  }, true);

});

// Mailchimp form!
document.getElementById('mc-embedded-subscribe-form').addEventListener('submit', function (evt) {
  evt.preventDefault();

  // Tell form its loading and disable input
  document.getElementById('mc-button').classList.toggle('is-loading');
  document.getElementById('mc-button').disabled = true;
  document.getElementById('mce-EMAIL').disabled = true;

  submitForm();

});

function errorMessage(error, parent) {
  var errorMsg = error.includes(' - ') ? error.substring(3) : error;
  var dispayError = document.createElement('p');
  dispayError.setAttribute('id', 'mc-error-message');
  dispayError.setAttribute('class', 'help is-danger');
  dispayError.innerHTML = errorMsg;
  document.getElementById(parent).appendChild(dispayError);
}

function submitForm() {

  var email = encodeURIComponent(document.getElementById('mce-EMAIL').value);
  var sourceUrl = encodeURIComponent(window.location);

  var queryData = 'EMAIL=' + email +
    '&=b_9c6287d73fb594aeb6a7a28ac_02218ac43f=' +
    '&c=mailchimpCallback';

  this._script = document.createElement("script");
  this._script.type = "text/javascript";
  this._script.id = "mc-callback"
  this._script.src = 'https://geojs.us14.list-manage.com/subscribe/post-json?u=9c6287d73fb594aeb6a7a28ac&amp;id=02218ac43f&' + queryData;

  // Clean up an error message and 'is-danger' if we have it
  if (document.getElementById("mc-error-message")) {
    document.getElementById("mc-error-message").remove();
  }
  document.getElementById('mce-EMAIL').classList.remove('is-danger');

  // Add the script to our head for the callback
  document.getElementsByTagName("head")[0].appendChild(this._script);

}

function hideForm() {
  document.getElementById('mc-form').classList.add('is-sr-only');
  document.getElementById('mc-success-message').classList.remove('is-sr-only');
}

Element.prototype.remove = function () {
  this.parentElement.removeChild(this);
}

function mailchimpCallback(data) {
  if (data['result'] != "success") {
    errorMessage(data['msg'], 'mc-input');
    document.getElementById('mce-EMAIL').classList.add('is-danger');
  } else {
    hideForm();
  }

  // Untoggle form
  document.getElementById('mc-button').classList.toggle('is-loading');
  document.getElementById('mc-button').disabled = false;
  document.getElementById('mce-EMAIL').disabled = false;

  // Cleanup script
  document.getElementById("mc-callback").remove();
}

// Handle GeoJS response
function geoip(json) {
  var userip = document.getElementById("user_ip");
  var countrycode = document.getElementById("user_countrycode");
  userip.textContent = json.ip;
  countrycode.textContent = json.country_code;
}

// Traffic function
function traffic_data(traffic_levels) {
  var ctx = document.getElementById("traffic-chart");
  var timeFormat = 'DD/MM/YYYY';
  var myChart = new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [{
        data: traffic_levels,
        borderWidth: 1,
        borderColor: '#209cee',
        backgroundColor: 'rgba(32,156,238,0.4)'
      }]
    },
    options: {
      title: {
        display: false,
        text: "Last 60 days of traffic"
      },
      responsive: true,
      scales: {
        xAxes: [{
          type: "time",
          time: {
            parser: timeFormat,
            tooltipFormat: 'll'
          },
          scaleLabel: {
            display: false,
            labelString: 'Date'
          },
          gridLines: {
            color: "#CCDCE666"
          },
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Requests/day (in millions)'
          },
          gridLines: {
            color: "#CCDCE666"
          },
          ticks: {
            callback: function(label, index, labels) {
              return label/1000000+'m';
            }
          }
        }]
      },
      legend: {
        display: false
      },
      tooltips: {
        "mode": "index",
        "intersect": false,
        "cornerRadius": 3,
        "titleSpacing": 0,
        "bodySpacing": 0,
        "footerSpacing": 0,
        "titleMarginBottom": 5,
        "footerMarginTop": 0,
        "yPadding": 5,
        "caretPadding": 10,
        "caretSize": 0,
        displayColors: false,
        callbacks: {
          label: function(tooltipItem, data) {
            return tooltipItem.yLabel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' requests';
          }
        }
      }
    }
  });
}
