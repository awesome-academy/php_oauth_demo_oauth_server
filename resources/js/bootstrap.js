window._ = require('lodash');

/**
 * We'll load the axios HTTP library which allows us to easily issue requests
 * to our Laravel back-end. This library automatically handles sending the
 * CSRF token as a header based on the value of the "XSRF" token cookie.
 */

try {
    window.Popper = require('popper.js').default;
    window.$ = window.jQuery = require('jquery');

    require('bootstrap');
} catch (e) {
    //
}

window.axios = require('axios');

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

/**
 * Echo exposes an expressive API for subscribing to channels and listening
 * for events that are broadcast by Laravel. Echo and event broadcasting
 * allows your team to easily build robust real-time web applications.
 */

// import Echo from 'laravel-echo';

// window.Pusher = require('pusher-js');

// window.Echo = new Echo({
//     broadcaster: 'pusher',
//     key: process.env.MIX_PUSHER_APP_KEY,
//     cluster: process.env.MIX_PUSHER_APP_CLUSTER,
//     forceTLS: true
// });

$(document).ready(function () {
    axios.get('/oauth/clients')
    .then(response => {
        let html = '';
        for (var i = response.data.length - 1; i >= 0; i--) {
            html += `<div class="table-row-group text-center">
                        <div class="table-cell border p-3">
                            ${response.data[i].name}
                        </div>
                        <div class="table-cell border p-3">
                            ${response.data[i].redirect}
                        </div>
                        <div class="table-cell border p-3">
                            <button data-id="${response.data[i].id}"
                                class="js-delete-btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                Delete
                            </button>
                        </div>
                    </div>`;
        }
        $('#client-table').append(html);
    });

    $(document).on('click', '.js-delete-btn', function () {
        let self = this;
        let clientId = $(self).data('id');
        axios.delete('/oauth/clients/' + clientId)
            .then(response => {
                $(self).closest('.table-row-group').remove();
                $('#client-info').hide();
            });
    });

    $('#create-client-btn').click(function () {
        if (!$('#name').val().length || !$('#callback').val().length) {
            alert('Please input client info.');
            return;
        }
        let data = {
            name: $('#name').val(),
            redirect: $('#callback').val(),
        };

        axios.post('/oauth/clients', data)
            .then(response => {
                let html = '';
                html += `<div class="table-row-group text-center">
                            <div class="table-cell border p-3">
                                ${response.data.name}
                            </div>
                            <div class="table-cell border p-3">
                                ${response.data.redirect}
                            </div>
                            <div class="table-cell border p-3">
                                <button data-id="${response.data.id}"
                                    class="js-delete-btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                    Delete
                                </button>
                            </div>
                        </div>`;
                $('#client-table').append(html);
                $('#client-info').show();
                $('#client-info').find('#client-id input').val(response.data.id);
                $('#client-info').find('#client-secret input').val(response.data.secret);
            })
            .catch (response => {
                alert('Something went wrong, please try again.');
                $('#client-info').hide();
            });
    });
});
