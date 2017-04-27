(function() {
    var FLICKR_URL = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&format=json&nojsoncallback=1';
    var FLICKR_KEY = '12598f859b86a14b2f925b8d0e422989';
    
    function getPhotosForSearch(searchTerm) {
        var url = `${FLICKR_URL}&api_key=${FLICKR_KEY}&text=${searchTerm}`;
        
        return fetch(url)
        .then(response => response.json())
        .then(pictures => {
            var picturesArray = [];
            
            var pictureData = pictures.photos.photo;
            console.log(pictureData);
            var pictureUrl = '';
            
            pictureData.forEach(picture => {
                pictureUrl  = `https://farm${picture.farm}.staticflickr.com/${picture.server}/${picture.id}_${picture.secret}`;
                
                picturesArray.push({
                    thumb: `${pictureUrl}_t.jpg`,
                    large: `${pictureUrl}_h.jpg`,
                    title: picture.title
                });
            });
            console.log(picturesArray);
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
    
    var imageForm = document.querySelector('.imageForm');
    var searchInput = document.querySelector('.searchInput');
    var gallery = document.querySelector('.gallery');
    
    imageForm.addEventListener('submit', function() {
        event.preventDefault();
        
        var searchTerm = searchInput.value;
        
        getPhotosForSearch(searchTerm)
        .then(photos => {
            photos.forEach(photo => {
                var imageLink = document.createElement('li');
                var imageThumb = createFlickrThumb(photo);
                imageLink.appendChild(imageThumb);
                gallery.appendChild(imageLink);
            });
        });
    });
})();