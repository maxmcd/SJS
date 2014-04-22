//= require perfect-scrollbar-with-mousewheel.min
//= require twitterfetcher

var api_endpoint = 'http://api.tumblr.com/v2/blog/stephaniejonesstudio.tumblr.com/posts/photo?cb=' + Math.random() + '&'

// http://api.tumblr.com/v2/blog/sjstest.tumblr.com/posts/photo?api_key=boWLAecyT39ADARn6c4QstJYekwpNO1ZmSX5FAjEREDEGQwoP0&callback=tumblrPostsCallback
function tumblrPostsCallback(data) {
    var i, posts, firstTag
    console.log(data)
    posts = data.response.posts
    if (posts.length > 0) {
        firstTag = posts[0].tags[0]

        if (firstTag == 'about') {
            $('.' + firstTag).append('<img src="' + posts[0].photos[0].alt_sizes[0].url + '">')
            $('.' + firstTag).append(posts[0].caption)
        } else if (firstTag == 'magazines') {
            for (var i=0;i<posts.length;i++) { 
                if (i===0) {
                   $('.' + firstTag).append(
                       '<img src="' + 
                       posts[i].photos[0].alt_sizes[0].url + 
                       '">'
                   )
                }
                // $('.' + firstTag).append('<img src="' + posts[i].photos[0].original_size.url + '">')
                $('.' + firstTag + ' .horizontal').append(
                    '<div><span>' +
                    posts[i].caption +
                    '</span><img src="' + 
                    posts[i].photos[0].alt_sizes[2].url + 
                    '" data-large="' +
                    posts[i].photos[0].alt_sizes[0].url + 
                    '" data-title="' +
                    '"></div>'
                )
                $('.magazines-big').append(
                    '<div class="magazine number' + i + '"><div class="mag-header">' +
                    posts[i].caption +
                    '</div>'
                )
                for (var n=0;n<posts[i].photos.length;n++) {
                    console.log(posts[i].photos[n].alt_sizes[0].url)
                    $('.magazine.number' + i).append('<img src="' + posts[i].photos[n].alt_sizes[0].url + '">')
                }
                
                // Take the first tag, assume that's the class name of the content section
                // Then add all post photos (original size, this might be an issue)
            }
        } else {
            if (!$('.' + firstTag + ' .image-container').is('*')) {
                $('.' + firstTag).data('tag', firstTag)
                $('.' + firstTag).data('offset', 0)
                $('.' + firstTag).data('total', data.response.total_posts)
                $('.' + firstTag).append('<div class="image-container scrolling">')                    
            }
            
            for (i=0;i<posts.length;i++) { 
                // $('.' + firstTag).append('<img src="' + posts[i].photos[0].original_size.url + '">')
                $('.' + firstTag + ' .image-container').append('<img src="' + posts[i].photos[0].alt_sizes[0].url + '">')
                
                // Take the first tag, assume that's the class name of the content section
                // Then add all post photos (original size, this might be an issue)
            }
            $('.' + firstTag + ' .image-container').delay(300).removeClass('loading')
            // remove loading state from infinite scroll

            // $('.' + firstTag + ' .scrolling').perfectScrollbar()                                    
        }
    }
}
function tumblrWidgetCallback(data) {
    var i, posts
    posts = data.response.posts
    // console.log(posts)
    // $('.tumblr').append('<div class="image-container scrolling">') 
    // for (i=0;i<posts.length;i++) { 
        // $('.' + firstTag).append('<img src="' + posts[i].photos[0].original_size.url + '">')
        $('.tumblr').append(
            '<a target="_blank" href="' + posts[0].post_url +'"><img src="' + posts[0].photos[0].alt_sizes[0].url + '"></a>'
        )
        // Take the first tag, assume that's the class name of the content section
        // Then add all post photos (original size, this might be an issue)
    // }
}
function instagramWidgetCallback(data) {
    var i, posts
    posts = data.data
    console.log(posts)
    $('.instagram').append('<a target="_blank" href="' + posts[0].link +'"><img src="' + posts[0].images.low_resolution.url + '"></a>')
    // $('.instagram').append('<div class="image-container scrolling">') 
    // for (i=0;i<posts.length;i++) { 
    //     // $('.' + firstTag).append('<img src="' + posts[i].photos[0].original_size.url + '">')
    //     $('.instagram .image-container').append(
    //         '<a href="' + posts[i].link +'"><img src="' + posts[i].images.low_resolution.url + '"></a>'
    //     )
    //     // Take the first tag, assume that's the class name of the content section
    //     // Then add all post photos (original size, this might be an issue)
    // }
}
function scrollToNextElement(elementGroup) {
    for (var i=0;i<elementGroup.length;i++){
        console.log('Element: ')
        console.log(elementGroup.eq(i))
        console.log($(window).scrollTop())
        console.log(elementGroup.eq(i).offset().top)
        console.log('----')
        if ($(window).scrollTop() < elementGroup.eq(i).offset().top - 10) {
            $('html, body').animate({
                    scrollTop: elementGroup.eq(i).offset().top
                }, 500);
            break
        }
    }
}
$(function() {

    $('.nav-button').click(function() {
        if ($(window).width() > 768) {
            scrollToNextElement($('.row'))
        } else {
            scrollToNextElement($('.column'))
        }
    })

    $('.magazines .horizontal img').click(function() {
        $('.magazines > img').attr('src', $(this).data('large'))
    })
    //infinite scroll for scrolling sections
    $( ".scrolling" ).scroll(function(e) {
        if (
            !$(this).hasClass('loading') 
            && !$(this).hasClass('loading') 
            && $(this).scrollTop() > this.scrollHeight - $(this).height() - 300
        ) {
            $(this).addClass('loading')
            var column = $(this).parent()
            var offset = parseInt(column.data('offset')) + 20
            column.data('offset', offset) //set updated offset
            var tag = column.data('tag')
            if (offset > parseInt(column.data('total'))) {
                $(this).addClass('done')
            }
            $('body').append(
                unescape('%3Cscript src="' + api_endpoint + 'api_key=boWLAecyT39ADARn6c4QstJYekwpNO1ZmSX5FAjEREDEGQwoP0&callback=tumblrPostsCallback&tag=' + tag + '&offset=' + offset + '"%3E%3C/script%3E')
            ) 
            console.log(e)                    
        }

    });

    $('.magazine').click(function() {
        if ($(this).hasClass('open')) {
            $('.magazine').removeClass('open')
        } else {
            $('.magazine').removeClass('open')
            $(this).addClass('open')            
        }
    })

    twitterFetcher.fetch('456957071439577089', 'tweet', 1, true);
    //add perfect scrolling to sections
    $('.scrolling').perfectScrollbar({suppressScrollX: true})                
    $('.magazines .horizontal').perfectScrollbar({suppressScrollY: true})                
})
$(window).load(function() {
    $('.illustrations').height($('.about').height())
    $('.scrolling, .horizontal').perfectScrollbar('update');
});

var tags = ["elle2010", "about", "elle2011", "elle2011ac", "dujourcom", "magazines", "illustrations"]
// take all the content section names and make api calls to request posts with those tags
// write those posts
// This returns 20 posts by default
for (var i=0;i<tags.length;i++){
    document.write(
        unescape('%3Cscript src="' + api_endpoint + 'api_key=boWLAecyT39ADARn6c4QstJYekwpNO1ZmSX5FAjEREDEGQwoP0&callback=tumblrPostsCallback&tag=' + tags[i] + '"%3E%3C/script%3E')
    )                
}


document.write(
    unescape('%3Cscript src="http://api.tumblr.com/v2/blog/meandmissjones.tumblr.com/posts/photo?api_key=boWLAecyT39ADARn6c4QstJYekwpNO1ZmSX5FAjEREDEGQwoP0&callback=tumblrWidgetCallback"%3E%3C/script%3E')
)                
//https://api.instagram.com/v1/users/5995815/media/recent?callback=instagramWidgetCallback&client_id=58932edd9e9a4d29ab150ab619390876
document.write(
    unescape('%3Cscript src="https://api.instagram.com/v1/users/5995815/media/recent?callback=instagramWidgetCallback&client_id=58932edd9e9a4d29ab150ab619390876"%3E%3C/script%3E')
)                