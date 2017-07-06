// current color to alternate the color on randomColor() function
var currentColor = 0;

function storage() {

    var bookmark = {
        items: []
    }

    if (localStorage.getItem("bookmarks") === null){
        localStorage.setItem("bookmarks", JSON.stringify(bookmark))
    }   
    
}

function validateForm(siteName, siteUrl) {
    var errors = $(".errors");
    if (!siteName || !siteUrl) {
        // alert('Please fill in the form');
        var errorTemplate = (
            `<div class="alert alert-dismissible alert-danger">
            <button type="button" class="close" data-dismiss="alert">&times;</button>
            <strong>No data found!</strong>
            <p>Please fill in all the input and try submitting again.</p>
            </div>`
            )
        errors.html(errorTemplate);
        return false;
    }

    var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    var regex = new RegExp(expression);

    if (!siteUrl.match(regex)) {
        var errorTemplate = (
            `<div class="alert alert-dismissible alert-warning">
            <button type="button" class="close" data-dismiss="alert">&times;</button>
            <strong>Invalid URL.</strong>
            <p>Please enter a valid url and try submitting again.</p>
            </div>`
            )
        errors.html(errorTemplate);
        return false;
    }
    successAdded()
    return true;
}

function successAdded() {
    var errors = $(".errors");
    var errorTemplate = (
        `<div class="alert alert-dismissible alert-success">
        <button type="button" class="close" data-dismiss="alert">&times;</button>
        <p>Item successfully added.</p>
        </div>`
        )
    errors.html(errorTemplate);
    return true;
}

// panel-colors (alternate color or random) 
function randomColor() {
    var colors = ["primary", "info", "success"] // add any color like 
    // using random number to pick color
    // just change the currentIndex to currentColor :)
    // var currentIndex = Math.floor(Math.random() * colors.length - 1) + 1;

    // using alternate number to pick color
    var colorsLength = colors.length
    if (currentColor === colorsLength) {
        currentColor = 0
    }
    return "panel-" + colors[currentColor]
}

function dataParse(){
    return JSON.parse(localStorage.bookmarks)
}

function dataSync(data){
    localStorage.bookmarks = JSON.stringify(data)
}

// ** modifying state
function addItem(item) {
    var bookmark = dataParse()
    bookmark.items.push({
        siteName: item.siteName,
        siteURL: item.siteURL,
        color: item.color
    })
    dataSync(bookmark)
}
function getItem(pos) {
    var bookmark = dataParse()
    return bookmark.items[pos]
}
function changeItem(bookmark, pos, item) {
    dataParse().items[pos] = item;
}
function deleteItem(pos) {
    var bookmark = dataParse()
    bookmark.items.splice(pos, 1)
    dataSync(bookmark)
}

// ** rendering
// for rendering individual items
function renderItem(key, index, panelTemplate, itemAttr) {
    var panel = $(panelTemplate)
    panel.find("#js-sitename").text(key.siteName)
    panel.find("#js-siteurl").attr("href", key.siteURL)
    panel.attr(itemAttr, index)
    panel.addClass(key.color)
    return panel
}
// for rendering all items
function renderAll(appendArea, itemAttr) {
    var allItems = dataParse().items.map(function(key, index) {
        return renderItem(key, index, panelTemplate, itemAttr)
    })
    appendArea.html(allItems)
}
// for rendering the modal content (including form)
function renderModalContent(pos, modalDialog, siteName, siteURL) {
    var panel = $(modalTemplate)
    panel.find("#mod-site-name").attr("value", siteName)
    panel.find("#mod-site-url").attr("value", siteURL)
    return panel
}

// event-listeners
function eventListener() {
    var formElement = $("#bookmark-form")
    var siteName = $("#site-name")
    var siteURL = $("#site-url")
    var appendArea = $("#listing")
    var modalDialog = $(".modal-dialog")
    var itemAttr = "bookmark-item-id"
    var removeBtn = "#js-delete"
    var editBtn = "#js-edit"
    var modalBody = $(".modal")
    var modalForm = $("#modal-form")
    
    renderAll(appendArea)
    // form - submission
    formElement.submit(function(event) {
        event.preventDefault()
        var newSiteName = siteName.val()
        var newSiteURL = siteURL.val()
        var panelColor = randomColor()
        currentColor++

        if (!validateForm(newSiteName, newSiteURL)) {
            return false;
        }

        var item = {
            siteName: newSiteName,
            siteURL: newSiteURL,
            color: panelColor
        }

        addItem(item)
        renderAll(appendArea, itemAttr)
        this.reset()
    })

    // remove item listener
    appendArea.on("click", removeBtn, function(event) {
        var itemToDelete = parseInt($(this).closest("div[id^='js-item']").attr(itemAttr))
        deleteItem(itemToDelete)
        renderAll(appendArea, itemAttr)
    })

}

// templates 
var panelTemplate = (
    `<div class="bookmark-item panel" id="js-item">
    <div class="panel-heading">
    <h3 class="panel-title" id="js-sitename"></h3>
    </div>
    <div class="panel-body">
    <div class="col-sm-4">
    <a href="" class="btn btn-primary" id="js-siteurl">Visit</a>
    </div>
    <div class="col-sm-8 buttons">
    <a id="js-delete" class="btn btn-primary">Delete</a>
    <a id="js-edit" class="btn btn-default">Edit</a>
    </div>
    </div>
    </div>`
    )

var modalTemplate = (
    `<div class="modal-content">
    <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
    <h4 class="modal-title">Edit Bookmark</h4>
    </div>
    <div class="modal-body">
    <form id="modal-form">
    <div class="form-group">
    <label class="control-label" for="inputDefault">Site Name</label>
    <input type="text" class="form-control" id="mod-site-name">
    </div> 
    <div class="form-group">
    <label class="control-label" for="inputSmall">Site URL</label>
    <input class="form-control input-sm" type="text" id="mod-site-url">
    </div>
    </form>
    </div>
    <div class="modal-footer">
    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
    <button class="btn btn-primary" type="submit" id="js-modal-btn">Save changes</button>
    </div>
    </div>
    `
    )

// main function (ready document)
$(document).ready(function() {
    storage()
    eventListener()
})

