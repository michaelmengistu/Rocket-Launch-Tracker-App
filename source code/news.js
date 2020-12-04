
var request = new XMLHttpRequest();

request.onreadystatechange = function getLaunchInfo() {
    if(request.status == 200 && request.readyState == 4){
        var data = JSON.parse(this.response);
        console.log(data);
        for(i = 0; i < data.length; i++){
            //parses data from each news response
            var id = data[i].id;
            var title = data[i].title;
            var url = data[i].url;
            var imageUrl = data[i].imageUrl;
            var newsSite = data[i].newsSite;
            var summary = data[i].summary;
            var publishedAt = data[i].publishedAt;
            var updatedAt = data[i].updatedAt;

            var date = new Date(updatedAt);
            date = date.toLocaleString();
            //selects column card will go into
            var cardLocation = "#col1";
            if(i%3 == 1){
                cardLocation = "#col2";
            }
            else if(i%3 == 2){
                cardLocation = "#col3";
            }
            
            //attempts to make last row even by removing any hanging cards
            if(cardLocation == "#col1" && i == data.length -1){
                break;
            }
            //creates card for each news source and appends to body
            $("<div class=\"card border-secondary mb-3\">"
            + "<img class=\"card-img-top\" src=\"" + imageUrl + "\"alt=\"Article Image\">"
            + "<div class=\"card-body\">"
            +  "<h5 class=\"card-title\">" + title + "</h5>"
            +  "<p class=\"card-text\">" + summary + "</p>"
            +  "<a target=\"_blank\" href=\"" + url + "\" class=\"btn\">Go To Article</a>"
            +  "<p class=\"card-text\"><small class=\"text-muted\">Last Updated: " + date + "</small></p>" 
            +  "</div></div>").appendTo(cardLocation);
        }
    }
};
request.open('GET', 'https://spaceflightnewsapi.net/api/v2/articles', true)
request.send();

