// Javascript file to handle Blog related logic. 
// Main operations include Add blog, Update blog, Delete blog
//*****************************************************************************************/
// Members Page- Create new Blog
$(document).ready(function () {
    // Add Blog Button click control logic
    var newPostYes = "No";
    var firstTime = "Yes";
    var editPost = "No";
    var newBlogStatus = "";
    showhideblogwindow();
    $("#newblogbtn").on("click", showhideblogwindow);

    // Gets an optional query string from our url (i.e. ?post_id=23)
    var url = window.location.search;
    var postId;
    // Sets a flag for whether or not we're updating a post to be false initially
    var updating = false;

    if (url.indexOf("?post_id=") !== -1) {
        postId = url.split("=")[1];
        getPostData(postId);
    }

    // Getting jQuery references to the post body, title, form, and category select
    var bodyInput = $("#formbody");
    var titleInput = $("#title");
    var blogForm = $("#blog");

    // Adding an event listener for when the form is submitted
    $(blogForm).on("submit", function handleFormSubmit(event) {
        event.preventDefault();
        // Get email from the session cookies.  
        var blogEmail = localStorage.getItem("PetsTalkUser");
        blogemail = blogEmail;
        // Checking error for Posts
        if (!titleInput.val().trim() || !bodyInput.val().trim()) {
            return;
        }
        // Constructing a newPost object to hand to the database
        var newPost = {
            email: blogemail,
            title: titleInput.val().trim(),
            body: bodyInput.val().trim()
        };
        //console.log(newPost);
        // If we're updating a post run updatePost to update a post
        // Otherwise run submitPost to create a whole new post
        if (updating) {
            newPost.id = postId;
            updatePost(newPost);
        }
        else {
            submitPost(newPost);
        }
    });

    // Submits a new post and brings user to blog page upon completion
    function submitPost(Post) {
        $.post("/api/posts/", Post, function () {
            newPostYes = "No";
            window.location.href = "/members";
        });
    }

    // Gets post data for a post if we're editing
    function getPostData(id) {
        $.get("/api/posts/" + id, function (data) {
            if (data) {
                // If this post exists, prefill our cms forms with its data
                titleInput.val(data.title);
                bodyInput.val(data.body);
                // If we have a post with this id, set a flag for us to know to update the post
                // when we hit submit
                updating = true;
                showhideblogwindow();
            }
        });
    }

    // Update a given post, bring user to the blog page when done
    function updatePost(post) {
        $.ajax({
            method: "PUT",
            url: "/api/posts",
            data: post
        })
            .then(function () {
                window.location.href = "/blog";
            });
    }

    // General functions
    function showhideblogwindow() {

        newBlogStatus = $("#newblogbtn").text();
        if (firstTime === "Yes") {
            firstTime = "No";
            $("#newblogbtn").text("+Add New Post");
            $(".blog-content").css("display", "none");
            newPostYes = "No";
        }
        else {
            if ((newBlogStatus === "+Add New Post") || (newPostYes === "No") || (editPost === "Yes")) {
                $("#newblogbtn").text("-Cancel New Post");
                $(".blog-content").css("display", "block");
                newPostYes = "Yes";
            }
            else if ((newBlogStatus === "-Cancel New Post") || (newBlogStatus === "-Cancel Edit Post")) {
                $("#newblogbtn").text("+Add New Post");
                $(".blog-content").css("display", "none");
                newPostYes = "No";
                $("#title").val("");
                $("#body").val("");
            }
        }
        //console.log("New Post Button Value = " + newBlogStatus);
    }
    //*****************************************************************************************/
    // Members Page- Blog Management
    // blogContainer holds all of our posts
    var blogContainer = $(".blog-container");
    // Click events for the edit and delete buttons
    $(document).on("click", "button.delete", handlePostDelete);
    $(document).on("click", "button.edit", handlePostEdit);
    var posts;
    var blogEmail = localStorage.getItem("PetsTalkUser");

    // Getting the initial list of posts
    getPosts(blogEmail);

    // This function grabs posts from the database and updates the view
    function getPosts(email) {
        var emailString = email || "";
        if (emailString) {
            emailString = "/" + emailString;
        }
        $.get("/api/posts/email" + emailString, function (data) {
            posts = data;
            if (!posts || !posts.length) {
                displayEmpty();
            }
            else {
                initializeRows();
                if (editPost === "Yes") {
                    showhideblogwindow()
                    editPost = "No";
                }
            }
        });
    }

    // This function does an API call to delete posts
    function deletePost(id) {
        $.ajax({
            method: "DELETE",
            url: "/api/posts/" + id
        })
        .then(function () {
            getPosts(postCategorySelect.val());
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
    }

    // This function constructs a post's HTML
    function createNewRow(post) {
        var newPostCard = $("<div>");
        newPostCard.addClass("card");
        var newPostCardHeading = $("<div>");
        newPostCardHeading.addClass("card-header");
        var deleteBtn = $("<button>");
        deleteBtn.text("x");
        deleteBtn.addClass("delete btn btn-danger");
        var editBtn = $("<button>");
        editBtn.text("Edit");
        editBtn.addClass("edit btn btn-default");
        var newPostTitle = $("<h4>");
        var newPostDate = $("<small>");
        var newPostCategory = $("<h5>");
        var newPostCardBody = $("<div>");
        newPostCardBody.addClass("card-body");
        var newPostBody = $("<p>");
        newPostTitle.text(post.title + " ");
        newPostBody.text(post.body);
        var formattedDate = new Date(post.createdAt);
        //formattedDate = moment(formattedDate).format("MMMM Do YYYY, h:mm:ss a");
        formattedDate = moment(formattedDate).format("lll");
        newPostDate.text(formattedDate);
        newPostTitle.append(newPostDate);
        newPostCardHeading.append(deleteBtn);
        newPostCardHeading.append(editBtn);
        newPostCardHeading.append(newPostTitle);
        newPostCardHeading.append(newPostCategory);
        newPostCardBody.append(newPostDate);
        newPostCardBody.append(newPostBody);
        newPostCard.append(newPostCardHeading);
        newPostCard.append(newPostCardBody);
        newPostCard.data("post", post);
        return newPostCard;
    }

    // This function figures out which post we want to delete and then calls
    // deletePost
    function handlePostDelete() {
        var currentPost = $(this)
            .parent()
            .parent()
            .data("post");
        deletePost(currentPost.id);
    }

    // This function figures out which post we want to edit and takes it to the
    // Appropriate url
    function handlePostEdit() {
        newPostYes = "Yes";
        //firstTime = "Yes";
        editPost = "Yes";
        $("#newblogbtn").text("-Cancel Edit");
        var currentPost = $(this)
            .parent()
            .parent()
            .data("post");
        window.location.href = "/members?post_id=" + currentPost.id;
        showhideblogwindow();
    }

    // This function displays a message when there are no posts
    function displayEmpty() {
        blogContainer.empty();
        var messageH2 = $("<h6>");
        messageH2.css({ "text-align": "center", "margin-top": "50px" });
        messageH2.html("No posts yet for this category.Please create a new post.");
        blogContainer.append(messageH2);
    }

    // This function handles reloading new posts when the category changes
    function handleCategoryChange() {
        var newPostCategory = $(this).val();
        getPosts(newPostCategory);
    }

    // Following function Logs out a user and updates the Login/Logout Status in the database.
    $('#logout').on("click", function () {
        event.preventDefault();
        //socket.disconnect();
        var useremail = localStorage.getItem("PetsTalkUser");
        //console.log("Logging of user =" + useremail);
        //localStorage.removeItem("PetsTalkUser");    
        var signoutData =
        {
            email: useremail,
            logged: false
        }

        $.ajax({
            method: "PUT",
            url: "/logout",
            data: signoutData
        }).then(
            window.location.replace("/allvisitors")
        );
    });
    //*****************************************************************************************/
});
