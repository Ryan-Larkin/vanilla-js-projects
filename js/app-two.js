(function() {
    var FLICKR_URL = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&format=json&nojsoncallback=1';
    var FLICKR_KEY = '12598f859b86a14b2f925b8d0e422989';
    
    function getPhotosForSearch(searchTerm,page) {
        var url = `${FLICKR_URL}&api_key=${FLICKR_KEY}&text=${searchTerm}&page=${page}`;
        
        return fetch(url)
        .then(response => response.json())
        .then(pictures => {
            var picturesArray = [];
            console.log(pictures);
            var pictureData = pictures.photos.photo;
            var pictureUrl = '';
            
            pictureData.forEach(picture => {
                pictureUrl  = `https://farm${picture.farm}.staticflickr.com/${picture.server}/${picture.id}_${picture.secret}`;
                
                picturesArray.push({
                    thumb: `${pictureUrl}_t.jpg`,
                    large: `${pictureUrl}_h.jpg`,
                    title: picture.title
                });
            });
            return picturesArray;
        });
    }
    
    function createFlickrThumb(photoData) {
        var link = document.createElement('a');
        link.setAttribute('href', photoData.large);
        link.setAttribute('target', '_blank');
        
        var image = document.createElement('img');
        image.setAttribute('src', photoData.thumb);
        image.setAttribute('alt', photoData.title);
        
        link.appendChild(image);
        return link;
    }
    
    var imageForm = document.querySelector('.image-form');
    var searchInput = document.querySelector('.search-input');
    var gallery = document.querySelector('.gallery');
    
    imageForm.addEventListener('submit', function() {
        gallery.innerHTML = "";
        event.preventDefault();
        
        var searchTerm = searchInput.value;
        
        getPhotosForSearch(searchTerm, 1)
        .then(photos => {
            photos.forEach(photo => {
                var imageLink = document.createElement('li');
                var imageThumb = createFlickrThumb(photo);
                imageLink.appendChild(imageThumb);
                gallery.appendChild(imageLink);
            });
        });
    });
    
    var page = 1;
    var ticking = false;
    
    document.addEventListener('scroll', function(event) {
        ticking = false;
        setTimeout(function(e) {
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight && !ticking) {    
                page++;
                var searchTerm = document.querySelector('.search-input').value;
                console.log(searchTerm);
                getPhotosForSearch(searchTerm, page)
                .then(photos => {
                    photos.forEach(photo => {
                        var imageLink = document.createElement('li');
                        var imageThumb = createFlickrThumb(photo);
                        imageLink.appendChild(imageThumb);
                        gallery.appendChild(imageLink);
                    });
                });
                ticking = false;
            }
            ticking = true;
        }, 500);
            
    });
})();

var last_known_scroll_position = 0;
var ticking = false;

function doSomething(scroll_pos) {
  // do something with the scroll position
}

window.addEventListener('scroll', function(e) {
  last_known_scroll_position = window.scrollY;
  if (!ticking) {
    window.requestAnimationFrame(function() {
      doSomething(last_known_scroll_position);
      ticking = false;
    });
  }
  ticking = true;
});