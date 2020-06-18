$(document).ready(() => {
    $('.job-apply-button').click((event) => {
        const element = $(event.target);
        window.location.href = `/jobs/${element.attr('data-service')}/${element.attr('id')}`;
    });
})