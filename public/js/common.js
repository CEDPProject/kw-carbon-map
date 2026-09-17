$(function () {
    if ($('#header.header2 .gnb .depth3 > li > a').hasClass('active')) {
        //$('.active').parent().parent().stop().slideDown(400);
        $('.active').parent().parent().siblings('a').addClass('on');
        $('.active').parent().parent().css('display', 'block');
        //$('.active').parent().parent().parent().parent().stop().slideDown(400);
        $('.active').parent().parent().parent().parent().css('display', 'block');
        $('.active').parent().parent().parent().parent().siblings('a').addClass('on');
    }
    if ($('#header.header2 .gnb .depth2 > li > a').hasClass('active')) {
        //$('.active').parent().parent().stop().slideDown(400);
        $('.active').parent().parent().css('display', 'block');
        $('.active').parent().parent().siblings('a').addClass('on');

    }

    /*왼쪽메뉴*/
    $('#header.header2 .gnb .depth1 > li > a').off('click').on('click', function () {
        if ($(this).siblings().hasClass('depth2')) {
            if ($(this).hasClass('on')) {
                $(this).removeClass('on');
                $(this).siblings('.depth2').stop().slideUp(400);

            } else {
                $('#header.header2 .gnb .depth1 > li > a').removeClass('on');
                $('#header.header2 .gnb .depth1 > li > .depth2').stop().slideUp(400);
                $(this).addClass('on');
                $(this).siblings('.depth2').stop().slideDown(400);
            }
        }
    });
    $('#header.header2 .gnb .depth2 > li > a').on('click', function () {
        if ($(this).siblings().hasClass('depth3')) {
            if ($(this).hasClass('on')) {
                $(this).removeClass('on');
                $(this).siblings('.depth3').stop().slideUp(400);

            } else {
                $(this).addClass('on');
                $(this).siblings('.depth3').stop().slideDown(400);
            }
        }
    });
    $('#header.header2 .gnb .depth3 > li > a').on('click', function () {
        $('#header.header2 .gnb .depth3 > li > a').removeClass('active');
        $(this).addClass('active');
    });

    $(".custom_btn label").on('click', function () {
        // if('.custom_btn input[type="checkbox"]').is(":checked"){

        // }
    });
    // $('#loginButton').on('click', async function () {
    //     const id = $(".ip_box #id").val() /* get the ID from user input */;
    //     const password = $(".ip_box #password").val()/* get the password from user input */;

    //     try {
    //         const response = await fetch('/login', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify({ id, password })
    //         });

    //         if (response.ok) {
    //             // Authentication successful, proceed to the monitoring page
    //             window.location.href = '/monitoring/index.html';
    //         } else {
    //             // Authentication failed, display an error message
    //             alert("아이디 또는 패스워드를 확인해주세요")
    //         }
    //     } catch (error) {
    //         alert("아이디 또는 패스워드를 확인해주세요")
    //     }
    // });
    $('#logoutButton').on('click', async function () {
        try {
            const response = await fetch('/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                // Clear client-side storage (if applicable)

                // Redirect to login page
                window.location.href = '/login.html';
            } else {
                console.error('Logout failed');
            }
        } catch (error) {
            console.error('An error occurred', error);
        }
    })



    if ($("#reportPage").length) {
        const topBar = $(".report_fix").offset();

        $(window).scroll(function () {

            const pos = $(document).scrollTop();
            const fixedBar = $(".report_fix");

            if (pos > topBar.top) {
                fixedBar.addClass("fixed");
            } else {
                fixedBar.removeClass("fixed");
            }

        });
    }



});
function openPop(id) {
    $('#' + id).stop().fadeIn(300);
}
function closePop(id) {
    $('#' + id).stop().fadeOut(300);
}

