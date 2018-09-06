// Javascript file to handle Blog related logic. 
// Main operations include Add blog, Update blog, Delete blog
// We have section in this file
// Members Page- Create new Blog
$(document).ready(function() {
    // Add Blog Button click control logic
    var newPostYes = "No";
    var firstTime = "Yes";
    var editPost = "No";
    var newBlogStatus = "";

    // Getting the initial list of posts
    getAllPosts();
    // Gets an optional query string from our url (i.e. ?post_id=23)
    var url = window.location.search;
    var postId;
    // Sets a flag for whether or not we're updating a post to be false initially
    var updating = false;
  
    // If we have this section in our url, we pull out the post id from the url
    // In localhost:8080/cms?post_id=1, postId is 1
    if (url.indexOf("?post_id=") !== -1) {
      postId = url.split("=")[1];
      getPostData(postId);
    }
  
    // Getting jQuery references to the post body, title, form, and category select
    var bodyInput = $("#body");
    var titleInput = $("#title");
    var blogForm = $("#blog");

    //var postCategorySelect = $("#category");
    // Submits a new post and brings user to blog page upon completion
    function submitPost(Post) {
      $.post("/api/posts/", Post, function() {
        newPostYes = "No";
        showhideblogwindow();
        window.location.href = "/blog";
      });
    }
  
    // Gets post data for a post if we're editing
    function getPostData(id) {
      $.get("/api/posts/" + id, function(data) {
        if (data) {
          // If this post exists, prefill our cms forms with its data
          titleInput.val(data.title);
          bodyInput.val(data.body);
          // If we have a post with this id, set a flag for us to know to update the post
          // when we hit submit
          updating = true;
          console.log("BlogStatus11" + newBlogStatus);
          showhideblogwindow();
        }
      });
    }
  
    // General functions
    // Members Page- Blog Management
    // blogContainer holds all of our posts
    var blogContainer = $(".blog-container");
    //var postCategorySelect = $("#category");
    var posts;
    // This function grabs posts from the database and updates the view
    function getAllPosts(category) {
        var categoryString = category || "";
        if (categoryString) {
        categoryString = "/category/" + categoryString;
        }
        $.get("/api/posts", function(data) {
        //console.log("Posts", data);
        //console.log("Category=" + categoryString);
        posts = data;
        if (!posts || !posts.length) {
            displayEmpty();
        }
        else {
            initializeRows();
        }
        });
    }

    // InitializeRows handles appending all of our constructed post HTML inside
    // blogContainer
    function initializeRows() {
        blogContainer.empty();
        var postsToAdd = [];
        for (var i = 0; i < posts.length; i++) {
        postsToAdd.push(createNewRow(posts[i]));
        }
        blogContainer.append(postsToAdd);
        blogContainer.append("<div><br></br></div>");
    }

    // This function constructs a post's HTML
    function createNewRow(post) {
        var newPostCard = $("<div>");
        newPostCard.addClass("card mx-auto");
        var newPostCardHeading = $("<div>");
        newPostCardHeading.addClass("card-header");
        var newPostTitle = $("<h5>");
        var newPostDate = $("<small>");
        var newPostCategory = $("<h6>");
        //newPostCategory.text(post.category);
        // newPostCategory.css({
        // float: "right",
        // "font-weight": "700",
        // "margin-top":
        // "-15px"
        // });
        var newPostCardBody = $("<div>");
        newPostCardBody.addClass("card-body");
        var newPostBody = $("<p>");
        newPostTitle.text(post.title + " ");
        newPostBody.text(post.body);
        var formattedDate = new Date(post.createdAt);
        //formattedDate = moment(formattedDate).format("MMMM Do YYYY, h:mm:ss a");
        formattedDate = moment(formattedDate).format("lll");
        formattedDate = formattedDate + ".       Posted by " + post.email;
        newPostDate.text(formattedDate);
        newPostTitle.append(newPostDate);
        newPostCardHeading.append(newPostTitle);
        newPostCardHeading.append(newPostCategory);
        newPostCardBody.append(newPostDate);
        newPostCardBody.append(newPostBody);
        newPostCard.append(newPostCardHeading);
        newPostCard.append(newPostCardBody);
        newPostCard.append("<br>");
        newPostCard.data("post", post);
        return newPostCard;
    }

    // This function displays a message when there are no posts
    function displayEmpty() {
        blogContainer.empty();
        var messageH2 = $("<h6>");
        messageH2.css({ "text-align": "center", "margin-top": "50px" });
        messageH2.html("No posts yet for this category.Please create a new post.");
        blogContainer.append(messageH2);
    }



});