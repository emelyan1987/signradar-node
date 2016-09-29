var map;
var geocoder;
var markers = [];

function GetAreaAvatars() {
    var city = $('#hdn_city').val();
    var prov = $('#hdn_prov').val();
    var country = $('#hdn_country').val();
    var obj = $(this).serializeObject();
    obj.city = city;
    obj.prov = prov;
    obj.country = country.replace("-", " ");;
    obj = JSON.stringify(obj);


    sendAjax("GetAreaAvatars", obj, Success_GetAreaAvatars, Fail_GetAreaAvatars);
}

function Success_GetAreaAvatars(res) {
    var tem;
    for (ini = 0; ini <= res.d.length - 1; ini++) {
        tem += "<div style=''>";
        tem += "<img src='" + res.d[ini].Image + "' style='height:75px; width:75px; float:left' onError='this.onerror=null;this.src=\"https://signradar.com/UserFiles/female.png\";' />";
        //tem += "<br/><span style='float:left'>" + res.d[ini].UserName + "</span></div><hr/>";

    }
    $("#AreaAvatars").html(tem.replace("undefined", ""));
}
function Fail_GetAreaAvatars(res) {
    alert(JSON.stringify(res));
}

function sendAjax(webMethod, parameters, callbackSuccess, callbackFail) {

    $.ajax({
        type: "POST",
        url: 'https://signradar.com/api2.asmx/' + webMethod,
        cache: false,
        data: parameters,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: callbackSuccess,
        error: callbackFail

    });
}


$(document).ready(function () {

    //Check user Authentication
    var auth = readCookie('AuthToken');
    var userid = readCookie('UserId');

    if (auth == null)
        auth = '00000000-0000-0000-0000-000000000000';
    if (userid == null || !$.isNumeric(userid))
        userid = '0';

    var obj2 = $(this).serializeObject();
    obj2.AuthToken = auth;
    obj2.userId = userid;
    obj2 = JSON.stringify(obj2);

    try {
        $('#div_loadingMain').show();
        sendAjax("IsUserAuthenticate", obj2, Success_CheckUserAuthentication, Fail_CheckUserAuthentication);
    }
    catch (ex) {
        //  alert(ex);
    }
    // End Authentication

    $('#btn_logout').click(function () {

        resetLogin();
        window.location.reload();

    });


    $('.logo2').on('click', function () {
        location.reload();
    })

    $(".myBtn3").click(function () {
        $("#myModal3").modal({
            backdrop: "static"
        });
    });
    $(".myBtn2").click(function () {
        $("#myModal2").modal({
            backdrop: "static"
        });
    });
    $(".myBtn1").click(function () {
        $("#myModal1").modal({
            backdrop: "static"
        });
    });


    //show Chat
    $("#addClass").click(function () {
        $('#qnimate').addClass('popup-box-on');
        //GetUserChat();
    });

    //insert chat
    $("#btn-chat").click(function () {

        var txt_chatLine = $('#txt_chat').val();

        if (txt_chatLine.trim().length > 0) {
            InsertUserChat();
        }
        else {
            alert('Enter Text');
            $('#txt_chat').focus();
        }


    });


    $("#removeClass").click(function () {
        $('#qnimate').removeClass('popup-box-on');
    });

    //amin additions
    //when the page first loads, if we have a logged in user, then we show the avatar image.  Otherwise if 
    //the user is not loggin yet, we show the ASL video
    //do we have an UserAvatar in the doc cookie?  if so, good enough.  We remove the video and replace it with the avatar.



    //change the flag on registeration popup when the user changes country.  Also, we replace location controls based on the country
    $("#regImageFlag").hide();
    $("#country").on('change', RegPopupChangeCountryFlagImageAndControls);


    //hide the initial city/state/zip for the registeration.  If US, then only zip code.  Other places we show city state/prov/dis
    $("#divCity").hide();
    $("#divState").hide();
    $("#divZipcode").hide();

    //upload avatar logic
    $("#btnUploadAvatar").click(UploadAvatar);

    //close reg dialog box
    $("#btnRegClose").click(CloseRegisterationModel);

    //initialize google map
    initialize();

    //search button
    $("#SearchButton").click(SearchButtonClick);

    //tabs logic
    $('.tabspicker li').click(TabsPicker);

 

});


(function ($) {
    "use strict";

    // Options for Message
    //----------------------------------------------
    var options = {
        'btn-loading': '<i class="fa fa-spinner fa-pulse"></i>',
        'btn-success': '<i class="fa fa-check"></i>',
        'btn-error': '<i class="fa fa-remove"></i>',
        'msg-success': 'All Good! Redirecting...',
        'msg-error': 'Wrong login credentials!',
        'useAJAX': true,
    };

    // Login Form
    //----------------------------------------------
    // Validation
    $("#login-form").validate({
        rules: {
            Username: "required",
            Password: "required",
        },
        errorClass: "form-invalid"
    });

    // Form Submission
    $("#login-form").submit(function () {
        // alert("aaa");
        remove_loading($(this));

        if (options['useAJAX'] == true) {
            // Dummy AJAX request (Replace this with your AJAX code)
            // If you don't want to use AJAX, remove this
            //dummy_submit_form($(this));
            var obj = $(this).serializeObject();
            obj.KeepLogin = obj.KeepLogin == "on" ? true : false;
            obj.IsEnCrypted = false;
            obj = JSON.stringify(obj);
            // alert(obj);
            $('#div_loadingMain').show();
            sendAjax("AuthenticateUser", obj, LoginSuccess, LoginFail);
            // Cancel the normal submission.
            // If you don't want to use AJAX, remove this
            return false;
        }
    });


    // Register Form
    //----------------------------------------------
    // Validation
    $("#register-form1").validate({
        rules: {
            reg_username: "required",
            reg_password: {
                required: true,
                minlength: 5
            },
            reg_password_confirm: {
                required: true,
                minlength: 5,
                equalTo: "#register-form [name=reg_password]"
            },
            reg_email: {
                required: true,
                email: true
            },
            reg_agree: "required",
        },
        errorClass: "form-invalid",
        errorPlacement: function (label, element) {
            if (element.attr("type") === "checkbox" || element.attr("type") === "radio") {
                element.parent().append(label); // this would append the label after all your checkboxes/labels (so the error-label will be the last element in <div class="controls"> )
            } else {
                label.insertAfter(element); // standard behaviour
            }
        }
    });

    // Form Submission
    $("#register-form").submit(function () {
        remove_loading($(this));

        if (options['useAJAX'] == true) {
            // Dummy AJAX request (Replace this with your AJAX code)
            // If you don't want to use AJAX, remove this
            //dummy_submit_form($(this));
            // alert($("#Country").val());
            var obj = $(this).serializeObject();
            obj.TnC = obj.TnC == "on" ? true : false;
            obj.defaultzipcode = obj.zipcode == "" ? "99999" : obj.zipcode;
            obj.country = $("#country").val();
            var stemp = $("#stateusa").val();
            if (obj.country == "United States" && stemp == "Please choose State.") {
                alert("Please choose a state.");
                return false;
            }
            if (obj.country == "Please choose your country") {
                alert("Please choose a country.");
                return false;
            }

            if (obj.country == "United States") {
                obj.state = stemp;
            }
            obj = JSON.stringify(obj);

            //alert(obj);
            $('#div_loadingMain').show();
            sendAjax("RegRegsiterUser", obj, RegisterSuccess, RegisterFail);
            // Cancel the normal submission.
            // If you don't want to use AJAX, remove this
            return false;
        }
    });

    // Forgot Password Form
    //----------------------------------------------
    // Validation
    $("#forgot-password-form").validate({
        rules: {
            fp_email: "required",
        },
        errorClass: "form-invalid"
    });

    // Form Submission
    $("#forgot-password-form").submit(function () {

        remove_loading($(this));

        if (options['useAJAX'] == true) {
            // Dummy AJAX request (Replace this with your AJAX code)
            // If you don't want to use AJAX, remove this

            var txt_fp_email = $('#fp_email').val();

            if ($(this).valid() && txt_fp_email.trim().length > 0) {

                $('#div_loadingMain').show();

                var obj = $(this).serializeObject();
                obj.email = txt_fp_email.trim();
                obj = JSON.stringify(obj);
                sendAjax('ValidateEmail', obj, Success_SendForgetMail, Fail_SendForgetMail)

            }

            // Cancel the normal submission.
            // If you don't want to use AJAX, remove this
            return false;
        }
    });

    // Loading
    //----------------------------------------------
    function remove_loading($form) {
        $form.find('[type=submit]').removeClass('error success');
        $form.find('.login-form-main-message').removeClass('show error success').html('');
    }

    function form_loading($form) {
        $form.find('[type=submit]').addClass('clicked').html(options['btn-loading']);
    }

    function form_success($form) {
        $form.find('[type=submit]').addClass('success').html(options['btn-success']);
        $form.find('.login-form-main-message').addClass('show success').html(options['msg-success']);
    }

    function form_failed($form) {
        $form.find('[type=submit]').addClass('error').html(options['btn-error']);
        $form.find('.login-form-main-message').addClass('show error').html(options['msg-error']);
    }

    // Dummy Submit Form (Remove this)
    //----------------------------------------------
    // This is just a dummy form submission. You should use your AJAX function or remove this function if you are not using AJAX.
    function dummy_submit_form($form) {
        return;
        if ($form.valid()) {
            form_loading($form);

            setTimeout(function () {
                form_success($form);
            }, 2000);
        }
    }





    //set authentication cookies
    function SetAuthenticationCookiesLogin(res) {
        if ($("#KeepLogin").is(':checked')) {
            createCookie("AuthToken", res.d.AuthToken, 99);
            createCookie("UserId", res.d.Id, 99);
            createCookie("UserAvatar", res.d.Avatar, 99);
            createCookie("Username", $("#Username").val(), 99);
            createCookie("UserZipCode", res.d.DefaultZipcode, 99);
            createCookie("UserProfileBio", res.d.tblProfile_bio, 99);
            createCookie("UserProfileShowBio", res.d.tblProfile_showBio, 99);
        } else {
            createCookie("AuthToken", res.d.AuthToken);
            createCookie("UserId", res.d.Id);
            createCookie("UserAvatar", res.d.Avatar);
            createCookie("Username", $("#Username").val());
            createCookie("UserZipCode", res.d.DefaultZipcode);
            createCookie("UserProfileBio", res.d.tblProfile_bio);
            createCookie("UserProfileShowBio", res.d.tblProfile_showBio);
        }
        createCookie("City", res.d.City);
        createCookie("State", res.d.State);
        createCookie("Country", res.d.Country);
        var addressconcat = res.d.City;
        if (res.d.State == "")
            addressconcat += "," + res.d.Country;
        else
            addressconcat += "," + res.d.State + " " + res.d.Country.toString().replace("-", " ").trim();
        //      alert(addressconcat);
        codeAddress(addressconcat);
    }

    //auth cookie when register
    function SetAuthenticationCookiesRegister(res) {

        createCookie("AuthToken", res.d.AuthToken, 99);
        createCookie("UserId", res.d.Id, 99);
        createCookie("UserAvatar", 'https://signradar.com/userfiles/malefemale.png', 99);
        createCookie("Username", $("#username").val(), 99);
        createCookie("UserCountry", $("#country").val(), 99);
        createCookie("City", res.d.City);
        createCookie("State", res.d.State);
        createCookie("Country", res.d.Country);


    }
    //Register


    function RegisterSuccess(res) {
        $('#div_loadingMain').hide();
        //return;
        // alert(res.d);
        if (res.d.Id == 0) {
            alert(res.d.Action);
            return;
        }
        SetAuthenticationCookiesRegister(res);
        $("#UserAvatarPic").attr('src', readCookie("UserAvatar")).show();
        $("#UserAvatarPic_setting").attr('src', readCookie("UserAvatar")).show();
        $("#UsernameDisplay").html($("#username").val());
        $("#divVideo").hide();
        $('#li_setting').show();
        $('#li_inbox').show();
        //hide the register form and show upload avatar.

        $("#divRegForm").hide('fast');

        $("#iFrameUploadAvatar").attr('src', 'iFrameImage.aspx?AuthToken=' + readCookie("AuthToken") + "&UserId=" + readCookie("UserId"));
        $("#iFrameUploadAvatar").show('slow');

    }

    function RegisterFail(res) {
        $('#div_loadingMain').hide();
        alert(res.d);
    }
    //login success
    function LoginSuccess(res) {

        //alert(res.d);
        $('#div_loadingMain').hide();

        if (res.d == null) {
            alert("Authentication failed.  Please try again.");
            resetLogin();
            return;
        } else {
            SetAuthenticationCookiesLogin(res);
        }

        $('#div_login').hide();
        $('#btn_username').show();
        $("#UserAvatarPic").attr('src', res.d.Avatar).show();
        $("#UserAvatarPic_setting").attr('src', res.d.Avatar).show();
        $('#li_setting').show();
        $('#li_inbox').show();
        $("#UsernameDisplay").html($("#Username").val());
        $("#divVideo").hide();
        form_success($("#login-form"));
        $("#LoginDialogCloseButton").click();

        $('#txt_userZipCode').val(res.d.DefaultZipcode);
        $('#txbxPersonalBio').val(res.d.tblProfile_bio);

        if (res.d.tblProfile_showBio == true)
            $('#reg_form_checkboxbio').attr('checked', true);
        else
            $('#reg_form_checkboxbio').attr('checked', false);


        //enable post message
        $('#btn_post').prop('disabled', false);
        $('#txt_postMsg').prop('placeholder', "Type your message here..");
        $('#txt_postMsg').prop('disabled', false);
        //enable chat
        $('#btn-chat').prop('disabled', false);
        $('#txt_chat').prop('placeholder', "Type your message here..");
        $('#txt_chat').prop('disabled', false);
    }

    function LoginFail(res) {
        //todo
        $('#div_loadingMain').hide();
        alert(res.d);
    }


    $.fn.serializeObject = function () {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };

    function createCookie(name, value, days) {
        var expires;

        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toGMTString();
        } else {
            expires = "";
        }
        document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
    }

    function readCookie(name) {
        var nameEQ = encodeURIComponent(name) + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
        }
        return null;
    }

    function eraseCookie(name) {
        createCookie(name, "", -1);
    }

})(jQuery);

function RegPopupChangeCountryFlagImageAndControls() {
    var sel = $(this).val();

    var country = sel.toString().trim().replace(' ', '-').trim();
    var imgurl = '/assets/image/png/' + country + '-Flag-128.png';
    //alert(imgurl);
    $("#regImageFlag").attr('src', imgurl);
    $("#regImageFlag").show('slow');

    //replace controls based on country location.  If US show only zip code.  Others city and state.

    if (country == "United-States") {
        $("#divZipcode").show('slow');
        $("#divCity").show();
        $("#divStateUSA").show();
        $("#zipcode").attr('placeholder', 'Postal code (Optional)');
        $("#divState").hide();
    } else {
        $("#divZipcode").show('slow');
        $("#zipcode").attr('placeholder', 'Postal code (Optional)');
        $("#divCity").show('slow');
        $("#divState").show('slow');
        $("#divStateUSA").hide();
    }


}

function createCookie(name, value, days) {
    var expires;

    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    } else {
        expires = "";
    }
    document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = encodeURIComponent(name) + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name, "", -1);
}

//upload avatar
function UploadAvatar() {
    alert("upload avatar");
}

function CloseRegisterationModel() {
    //  alert("CLose");
    $("#myModel2").modal("close");
    window.location.reload();
}

//map logic

function initialize() {

    geocoder = new google.maps.Geocoder();

    var latlng = new google.maps.LatLng(40.713649, -74.008713);
    var mapOptions = {
        zoom: 12,
        center: latlng
    };

    map = new google.maps.Map(document.getElementById("googleMap"), mapOptions);

    google.maps.event.addListener(map, "mouseup", function (e) {
        // alert(e.latLng);
        MapClicked(e.latLng, "users");
    });

    // Call the codeAddress function (once) when the map is idle (ready)
    google.maps.event.addListenerOnce(map, 'idle', codeAddress);

    $.getJSON("https://freegeoip.net/json/", function (data) {
        codeAddress(data.city + " " + data.region_name + " " + data.country_name);
    });

    LoadMarkerOnMap()



}
function GetMapData_Success(res) {
    //users
    var addresses = res.d.RegUsersZip.toString().split(',');

    for (var x = 0; x < addresses.length; x++) {

        try {

            //   var p = data.results[0].geometry.location
            var latlng = new google.maps.geocoder({ address: res.d[x].city + " " + res.d[x].state + " " + res.d[x].country });//   .LatLng(addresses[x].split('|')[1], addresses[x].split('|')[0]);

            var mrkr = new google.maps.Marker({
                position: latlng,
                map: map,
                //title: "Zip code: " + addresses[x].split('|')[2],
            });

            mrkr.addListener('click', function (b) {
                MapClicked(b.latLng);
            });


        } catch (e) {
            var psd = e;
        }
    }
}
function GetMapData_Fail(res) {

}


function codeAddress(address) {

    if (address == undefined || address == "") {
        return;
    }

    geocoder.geocode({
        'address': address
    }, function (results, status) {

        if (status == google.maps.GeocoderStatus.OK) {

            //latLng
            MapClicked(results[0].geometry.location, "users");
            // Center map on location
            map.panTo(results[0].geometry.location);

            map.zoom(12);

        } else {

            //   alert("Geocode was not successful for the following reason: " + status);
        }
    });
}

//search button click handler
function SearchButtonClick() {
    codeAddress($("#SearchInput").val());
}

//mapped clicked by mouse
function MapClicked(latlong, u) {
    var temp;
    temp = latlong;

    geocoder.geocode({ 'latLng': latlong }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            debugger;
            var level_1;
            var level_2;
            var country;
            var zip;
            for (var x = 0, length_1 = results.length; x < length_1; x++) {
                for (var y = 0, length_2 = results[x].address_components.length; y < length_2; y++) {
                    var type = results[x].address_components[y].types[0];
                    if (type === "administrative_area_level_1") {
                        level_1 = results[x].address_components[y].long_name;
                        if (level_2) break;
                    } else if (type === "locality") {
                        level_2 = results[x].address_components[y].long_name;
                        if (level_1) break;
                    } else if (type === "country") {
                        Country = results[x].address_components[y].long_name;
                    } else if (type === "postal_code") {
                        zip = results[x].address_components[y].long_name;
                    }
                }
            }
            updateAddress(level_2, level_1, Country, temp.lat(), temp.lng(), zip);
        }
    });
}


function updateAddress(city, prov, country, lati, longi, zip) {

    if (city != null && city != undefined && city.length > 0)
        $('#hdn_city').val(city);
    else
        $('#hdn_city').val('');

    if (prov != null && prov != undefined && prov.length > 0)
        $('#hdn_prov').val(prov);
    else
        $('#hdn_prov').val('');

    if ($.isNumeric(lati) && $.isNumeric(longi))
        $('#hdn_latlon').val(lati + ',' + longi);
    else
        $('#hdn_latlon').val('');


    if (city == undefined && prov == undefined) {
        alert("We're sorry.  We were unable to determine the city and state/prov.  Please zoom further for better targetting.");
        return;
    }
    //set the flag
    $("#spanCountryFlag").attr('src', '/assets/image/png/' + country.trim().replace(' ', '-').trim() + '-Flag-64.png');
    $('#hdn_country').val(country.trim().replace(' ', '-').trim());


    if (city == undefined) {
        $("#spanLocation").html(prov + ", " + country);
    } else {
        $("#spanLocation").html(city + "/" + prov + ", " + country);
    }
    //set the serch box to the current country
    //   $("#SearchInput").val("[" + country + "]:");

    $('#hdn_zip').val('');
    if (zip != undefined) {
        $("#spanLocationZip").html("Postal Code:" + zip);
        $('#hdn_zip').val(zip);
        $("#spanLocationExact").html(zip);
    }

    $("#spanLocationLatlng").html(lati + "," + longi);

    //ontop of the Post tab
    if (city != undefined) {
        $("#spanLocationHeader").html(city + "/" + prov + ", " + country);
    } else {
        $("#spanLocationHeader").html(prov + ", " + country);
    }

    // for getting chat
    GetUserChat();
    GetAreaAvatars();
    GetUserPost();
}

function TabsPicker() {

    var tab = $(this).find('a').html();
    //hight light tab
    $(this).siblings('li').removeClass('active');
    $(this).addClass('active');

    $(".TabGroups").hide();
    $("#t" + tab).show();

}



// funtion created by varun mahajan

$(document).ready(function () {


    $('#btn_ReportUser').click(function () {

        ReportAbuse();

    });

    $('#fu_PostImage').change(function (evt) {
        $('#fu_PostVideo').val('');
        $('#hdn_uploadType').val('');

        $('#image-holder').empty();
        $('#div_contantHolder').hide();

        //Get count of selected files
        var countFiles = $(this)[0].files.length;
        var imgPath = $(this)[0].value;
        var extn = imgPath.substring(imgPath.lastIndexOf('.') + 1).toLowerCase();
        var image_holder = $("#image-holder");
        image_holder.empty();
        if (extn == "gif" || extn == "png" || extn == "jpg" || extn == "jpeg") {
            if (typeof (FileReader) != "undefined") {
                //loop for each file selected for uploaded.
                for (var i = 0; i < countFiles; i++) {
                    var reader = new FileReader();
                    reader.onload = function (e) {


                        $("<img />", {
                            "src": e.target.result,
                            "class": "thumb-image"
                        }).appendTo(image_holder);


                    }
                    image_holder.show();
                    reader.readAsDataURL($(this)[0].files[i]);
                }

                $('#hdn_uploadType').val('1'); // for Image

                $('#div_upload').hide();
                $('#div_contantHolder').show();


            } else {
                alert("This browser does not support FileReader.");
            }
        } else {
            alert("Pls select only images");
        }

    });

    $('#fu_PostVideo').change(function (evt) {

        $('#fu_PostImage').val('');
        $('#hdn_uploadType').val('');

        $('#image-holder').empty();
        $('#div_contantHolder').hide();

        //Get count of selected files
        var countFiles = $(this)[0].files.length;
        var imgPath = $(this)[0].value;
        var extn = imgPath.substring(imgPath.lastIndexOf('.') + 1).toLowerCase();
        var image_holder = $("#image-holder");
        image_holder.empty();
        if (extn == "webm" || extn == "flv" || extn == "ogv" || extn == "ogg" || extn == "avi" || extn == "mov" || extn == "wmv" || extn == "mp4" || extn == "m4p" || extn == "m4v" || extn == "mpv") {
            if (typeof (FileReader) != "undefined") {
                //loop for each file selected for uploaded.
                for (var i = 0; i < countFiles; i++) {
                    var reader = new FileReader();
                    reader.onload = function (e) {


                        $("<img />", {
                            "src": '/images/video_img.png',
                            "class": "thumb-image"
                        }).appendTo(image_holder);


                    }
                    image_holder.show();
                    reader.readAsDataURL($(this)[0].files[i]);
                }

                $('#hdn_uploadType').val('2'); // for video

                $('#div_upload').hide();
                $('#div_contantHolder').show();


            } else {
                $(this).val('');
                alert("This browser does not support FileReader.");
            }
        } else {
            $(this).val('');
            alert("Pls select only video");
        }

    });

    $('#btn_deleteContent').click(function () {

        resetPost();
    });

    $('#btn_cancelUpload').click(function () {
        cancelUpload();
    });

    $('#btn_post').click(function () {

        UploadPost();

    });

    $('#fu_userAvatar').change(function () {

        UploadUserAvatar();

    });

   
    $('#btn_OpenYoutubeLink').click(function () {

        //   $('#div_youtubeLink').hide();
        $('#div_youtubeLink').toggle('slow');
    });

    $('#btn_IsValidYoutubeLink').click(function () {

        var url = $('#txt_youtubeLink').val();
        var id = matchYoutubeUrl(url);
        if (id != false) {
            // alert(id);
            $('#fu_PostImage').val('');
            $('#fu_PostVideo').val('');
            $('#hdn_uploadType').val('');

            $('#image-holder').empty();
            $('#div_contantHolder').hide();

            $('#hdn_youtubeId').val(id);
            $('#hdn_uploadType').val('3');
            $("#image-holder").empty();
            $("#image-holder").html('<iframe width="100" height="100" src="https://www.youtube.com/embed/' + id + '"></iframe>');
            $('#div_upload').hide();
            $("#div_contantHolder").show();
            $('#txt_youtubeLink').val('');
            $('#div_youtubeLink').hide();

        } else {
            alert('Incorrect URL');
        }

    });

    $('#btn_showInboxDiv').click(function () {
        GetUserInbox();
    });

    $('#btn_showSettingDiv').click(function () {

        var defaultZipCode = readCookie("UserZipCode");

        if (defaultZipCode != null && defaultZipCode != undefined) {
            $('#txt_userZipCode').val(defaultZipCode);
        }

    });


    $('#btn_updatePassword').click(function () {

        fn_CallChangePassword();

    });

    $('#btn_updateZipCode').click(function () {

        fn_CallChangeZipCode();

    });

    $('#btnPersonalProfile').click(function () {

        fn_CallChangeBio();

    });

    
    

});

var timer_getChat, timer_getPost;

function matchYoutubeUrl(url) {
    var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    var matches = url.match(p);
    if (matches) {
        return matches[1];
    }
    return false;
}

function resetPost() {
    $('#image-holder').empty();
    $('#hdn_uploadType').val('');
    $('#div_upload').show();
    $('#div_contantHolder').hide();
    $('#fu_PostImage').val('');
    $('#fu_PostVideo').val('');
    $('#txt_youtubeLink').val('');
    $('#hdn_youtubeId').val('');
    $('#div_youtubeLink').hide();
    $('#txt_postMsg').val('');
}

function clear_timer_getChat() {
    clearInterval(timer_getChat);
}

function clear_timer_getPost() {
    clearInterval(timer_getPost);
}


function GetUserChat() {

    clear_timer_getChat();

    var auth = readCookie('AuthToken');
    if (auth == null || auth == undefined)
        auth = '00000000-0000-0000-0000-000000000000';

    var userid = readCookie('UserId');
    if (userid == null || !$.isNumeric(userid) || userid == undefined)
        userid = '0';

    var pic = readCookie('UserAvatar');
    var username = readCookie('Username');
    var city = $('#hdn_city').val();
    var prov = $('#hdn_prov').val();
    var country = $('#hdn_country').val();


    if (country != '') {
        var obj = $(this).serializeObject();
        obj.AuthToken = auth;
        obj.userId = userid;
        obj.city = city;
        obj.prov = prov;
        obj.country = country;
        obj = JSON.stringify(obj);



        $('#div_loadingChat').show();
        sendAjax("GetChatLines2", obj, Success_GetChat, Fail_GetChat);
    }
    else {
        alert('Location Error! ,Select again Any location by clicking on map');
    }


}

function GetUserPost() {

    clear_timer_getPost();

    var auth = readCookie('AuthToken');
    if (auth == null || auth == undefined)
        auth = '00000000-0000-0000-0000-000000000000';

    var userid = readCookie('UserId');
    if (userid == null || !$.isNumeric(userid) || userid == undefined)
        userid = '0';

    var pic = readCookie('UserAvatar');
    var username = readCookie('Username');
    var city = $('#hdn_city').val();
    var prov = $('#hdn_prov').val();
    var country = $('#hdn_country').val();


    if (country != '') {
        var obj = $(this).serializeObject();
        obj.AuthToken = auth;
        obj.userId = userid;
        obj.city = city;
        obj.prov = prov;
        obj.country = country;
        obj = JSON.stringify(obj);


        $('#div_loadingPost').show();
        sendAjax("GetPostMsg2", obj, Success_GetPost, Fail_GetPost);
    }
    else {
        alert('Location Error! ,Select again Any location by clicking on map');
    }


}


function GetUserPostReplyByPostId(postid) {

    //$('#ul_postReplyContent').empty();

    var auth = readCookie('AuthToken');
    if (auth == null || auth == undefined)
        auth = '00000000-0000-0000-0000-000000000000';

    var userid = readCookie('UserId');
    if (userid == null || !$.isNumeric(userid) || userid == undefined)
        userid = '0';

    if ($.isNumeric(postid) && parseInt(postid) > 0) {
        var obj = $(this).serializeObject();
        obj.AuthToken = auth;
        obj.userId = userid;
        obj.parentIdStr = postid;
        obj = JSON.stringify(obj);

        $('#div_loadingPostReply').show();
        sendAjax("GetPostMsg2_Reply", obj, Success_GetPostReply, Fail_GetPostReply);
    }
    else {
        alert('Invalid post');
    }


}


function InsertUserChat() {

    var city = '', prov = '', county = '', country = '', Zip = '';
    var chatline = $('#txt_chat').val();

    var auth = readCookie('AuthToken');
    if (auth == null || auth == undefined)
        auth = '00000000-0000-0000-0000-000000000000';

    var userid = readCookie('UserId');
    if (userid == null || !$.isNumeric(userid) || userid == undefined)
        userid = '0';

    var pic = readCookie('UserAvatar');
    var username = readCookie('Username');
    city = $('#hdn_city').val();

    prov = $('#hdn_prov').val();
    zip = $('#hdn_zip').val();
    country = $('#hdn_country').val();
    latlon = $('#hdn_latlon').val();

    if (country != '') {
        var obj = $(this).serializeObject();
        obj.AuthToken = auth;
        obj.userId = userid;
        obj.city = city;
        obj.state = prov;
        obj.county = county;
        obj.country = country;
        obj.zip = zip;
        obj.latlon = latlon;
        obj.chatline = chatline;
        obj = JSON.stringify(obj);

        $("#btn-chat").html('<i class="fa fa-refresh fa-spin"></i>');
        sendAjax("InsertChatLine2", obj, Success_InsertChat, Fail_InsertChat);

    }
    else {
        alert('Location Error! ,Select again Any location by clicking on map');
    }
}

function Success_GetChat(res) {
    $('#div_loadingChat').hide();

    clear_timer_getChat();
    timer_getChat = setInterval(function () { GetUserChat(); }, 5000);

    $('#ul_chatContent').empty();
    if (res.d != null && res.d.length > 0) {
        $("#Chat_template").tmpl(res.d).appendTo("#ul_chatContent");

        var LUserId = readCookie("UserId");

        if ($.isNumeric(LUserId) && parseInt(LUserId) > 0)
            $('.btn_ReportUserflag' + LUserId).hide();

        $(".btn_spamChat").unbind('click');
        $(".btn_spamChat").click(function () {

            var blackListUserId = $(this).attr('data-userid');
            var rpt_userimg = $(this).attr('data-userImg');
            var rpt_username = $(this).attr('data-username');
            var blackList_chatid = $(this).attr('data-id');

            var source = 'chat';

            $('#hdn_blackListUserId').val(blackListUserId);
            $('#hdn_blackListSourceId').val(blackList_chatid);
            $('#hdn_blackListSource').val(source);

            $('#txtAccuserComment').val('').empty();
            $('#lbl_reportUsername').text('');
            $('#img_reportUser').prop('src', '');

            $('#lbl_reportUsername').text(rpt_username);
            $('#img_reportUser').prop('src', rpt_userimg);


            $("#modelReportSpam").modal({
                backdrop: "static"
            });
        });

    }
    else {
        $('#ul_chatContent').html('<div style="width:100%;height:auto;overflow:hidden;text-align:center">No Chat Found</div>');
    }
}

function Fail_GetChat(res) {

    debugger;

    $('#div_loadingChat').hide();
    clear_timer_getChat();
    // alert('Error222!');
}


function Success_GetPost(res) {
    $('#div_loadingPost').hide();

    clear_timer_getPost();
    timer_getPost = setInterval(function () { GetUserPost(); }, 60000); // 60 seconds

    $('#ul_postContent').empty();
    if (res.d != null && res.d.length > 0) {
        $("#Post_template").tmpl(res.d).appendTo("#ul_postContent");

        var LUserId = readCookie("UserId");

        //alert(LUserId);
        if ($.isNumeric(LUserId) && parseInt(LUserId) > 0) {
            $('.btn_ReportUserflag_post' + LUserId).hide();
            $('.btn_Edit_post' + LUserId).show();
        }

        $(".btn_spamPost").unbind('click');
        $(".btn_spamPost").click(function () {

            var blackListUserId = $(this).attr('data-userid');
            var rpt_userimg = $(this).attr('data-userImg');
            var rpt_username = $(this).attr('data-username');
            var blackList_chatid = $(this).attr('data-id');

            var source = 'post';

            $('#hdn_blackListUserId').val(blackListUserId);
            $('#hdn_blackListSourceId').val(blackList_chatid);
            $('#hdn_blackListSource').val(source);

            $('#txtAccuserComment').val('').empty();
            $('#lbl_reportUsername').text('');
            $('#img_reportUser').prop('src', '');

            $('#lbl_reportUsername').text(rpt_username);
            $('#img_reportUser').prop('src', rpt_userimg);

            $("#modelReportSpam").modal({
                backdrop: "static"
            });

        });

        $(".btn_show_replyPost").unbind('click');
        $(".btn_show_replyPost").click(function () {

            var reply_userid = $(this).attr('data-userid');
            var reply_userimg = $(this).attr('data-userImg');
            var reply_username = $(this).attr('data-username');
            var reply_postId = $(this).attr('data-id');
            var reply_postMsg = $(this).attr('data-message');

            var display_div = $('#div_modelPostReplies_' + reply_postId).css('display');

            $('.div_modelPostReplies_class').hide();
            if (display_div == 'none') {
                // alert('none1');
                $('#div_modelPostReplies_' + reply_postId).slideDown();


                $('#txtArea_replyPost_' + reply_postId).unbind('focus');
                $('#txtArea_replyPost_' + reply_postId).focus(function () {
                    clear_timer_getPost();
                });

                $('#txtArea_replyPost_' + reply_postId).unbind('focusout');
                $('#txtArea_replyPost_' + reply_postId).focusout(function () {

                    clear_timer_getPost();
                    timer_getPost = setInterval(function () { GetUserPost(); }, 60000); // 60 seconds

                });

                $('#btn_ReplyPost_' + reply_postId).unbind('click');
                $('#btn_ReplyPost_' + reply_postId).click(function () {

                    var replyPostId = $(this).attr('data-id');

                    fn_PostReplyWithPostId(reply_postId);

                });

                $('#txtArea_replyPost_' + reply_postId).focus();
                GetUserPostReplyByPostId(reply_postId);

            }
            else {
                $('#div_modelPostReplies_' + reply_postId).slideUp();
                $('#txtArea_replyPost_' + reply_postId).unbind('focus');
                $('#txtArea_replyPost_' + reply_postId).unbind('focusout');
            }



        });



    }
    else {
        var msg = "Welcome to " + $("#hdn_city").val() + "/" + $("#hdn_country").val() + "!<br/>Introduce yourself and connect!";
        $('#ul_postContent').html('<div style="width:100%;height:auto;overflow:hidden;text-align:center; font-size:16px">' + msg + '</div>');
    }
}

function Fail_GetPost(res) {
    $('#div_loadingPost').hide();
    clear_timer_getPost();
    // alert('Error loading Post!');
}


function Success_GetPostReply(res) {

    if ($.isNumeric(res.d.postid)) {

        $('#div_loadingPostReply_' + res.d.postid).hide();

        $('#ul_postReplyContent_' + res.d.postid).empty();
        if (res.d != null && res.d.lst_msg.length > 0) {
            $("#PostReply_template").tmpl(res.d.lst_msg).appendTo("#ul_postReplyContent_" + res.d.postid);

        }
        else {
            $('#ul_postReplyContent_' + res.d.postid).html('<div style="width:100%;height:auto;overflow:hidden;text-align:center">Be the first to reply.</div>');
        }
    }

}

function Fail_GetPostReply(res) {
    if ($.isNumeric(res.d.postid)) {
        $('#div_loadingPostReply_' + res.d.postid).hide();
    }
    //alert('Error loading Post Replies!');
}



function Success_InsertChat(res) {
    $("#btn-chat").html('Send');

    if (res.d == "1") {
        $('#txt_chat').val('');
        GetUserChat();
        LoadMarkerOnMap();
    }
    else if (res.d == "3")
        alert('Select Location');
    else if (res.d == "-1")
        alert('Please Signin to insert chat');
    else
        alert('Error! to send chat message');
}

function Fail_InsertChat(res) {
    $("#btn-chat").html('Send');
    //  alert('Error! in insertion, try again');
}

function Success_CheckUserAuthentication(res) {
    debugger;
    try {
        $('#div_loadingMain').hide();
        if (res.d != null && res.d == true) {
            $('#hdn_UserIsAuthenticated').val("1");
            $('#div_login').hide();
            $('#btn_username').show();
            $("#UsernameDisplay").html(readCookie("Username"));
            
            $('#li_setting').show();
            $('#li_inbox').show();

            var defaultZipCode = readCookie("UserZipCode");


            if (defaultZipCode != null && defaultZipCode != undefined)
            {
                $('#txt_userZipCode').val(defaultZipCode);
            }


            //enable post message
            $('#btn_post').prop('disabled', false);
            $('#txt_postMsg').prop('placeholder', "Type your message here..");
            $('#txt_postMsg').prop('disabled', false);
            //enable chat
            $('#btn-chat').prop('disabled', false);
            $('#txt_chat').prop('placeholder', "Type your message here..");
            $('#txt_chat').prop('disabled', false);

            var useravatar = readCookie("UserAvatar");
            if (useravatar != undefined) {
                $("#divVideo").hide();
                $("#UserAvatarPic").attr('src', readCookie("UserAvatar")).show();
                $("#UserAvatarPic_setting").attr('src', readCookie("UserAvatar")).show();
            } else {
                $("#divVideo").show();
                $("#UserAvatarPic").hide();
                $("#UserAvatarPic_setting").hide();
            }



            var profileBio = readCookie("UserProfileBio");
            var showProfileBio = readCookie("UserProfileShowBio");

            if (profileBio != null && profileBio != undefined) {
                $('#txbxPersonalBio').val(profileBio);
            }

            if(showProfileBio == true || showProfileBio == 'true')
            {
                $('#reg_form_checkboxbio').attr('checked', true);
            }
            else
            {
                $('#reg_form_checkboxbio').attr('checked', false);
            

                $('#hdn_UserIsAuthenticated').val("0");
                resetLogin();
            }

        }
    }
    catch (ex)
        { }
    }

    function Fail_CheckUserAuthentication(res) {
        $('#div_loadingMain').hide();
    }

    function resetLogin() {
        $('#divVideo').show();
        $('#div_login').show();
        $('#UserAvatarPic').hide();
        $('#UserAvatarPic').attr('src', 'https://signradar.com/userfiles/malefemale.png');
        $('#UserAvatarPic_setting').hide();
        $('#UserAvatarPic_setting').attr('src', 'https://signradar.com/userfiles/malefemale.png');
        $('#btn_username').hide();
        $('#li_setting').hide();
        $('#li_inbox').hide();
        $('#txt_userZipCode').val('');
        $('#fu_userAvatar').val('');
        eraseCookie('AuthToken');
        eraseCookie('UserAvatar');
        eraseCookie('UserId');
        eraseCookie('Username');
        eraseCookie('UserZipCode');



    



        //this section disables the post button and changes the message placeholder.  The user must be logged in to post msg.
        $('#btn_post').prop('disabled', true);
        $('#txt_postMsg').prop('disabled', true);
        $('#txt_postMsg').prop('placeholder', "Please login or register to post a message.");

        //chat section disables the chat button and changes the messages on the chat text box.
        $('#btn-chat').prop('disabled', true);
        $('#txt_chat').prop('disabled', true);
        $('#txt_chat').prop('placeholder', "Please login or register to chat!");
    }

    function Success_SendForgetMail(res) {

        try {
            $('#div_loadingMain').hide();
            if (res.d != null && res.d == true) {
                $('#fp_email').val();
                alert('Mail Sent Successfully!');
            }
            else {
                alert('Error! Invalid Mail');
            }

        }
        catch (ex)
        { }
    }

    function Fail_SendForgetMail(res) {
        $('#div_loadingMain').hide();
    }

    function ReportAbuse() {

        var BlackuserId = $('#hdn_blackListUserId').val();
        var BlackList_sourceId = $('#hdn_blackListSourceId').val();
        var BlackList_source = $('#hdn_blackListSource').val();

        if ($.isNumeric(BlackuserId) && parseInt(BlackuserId) > 0) {
            var auth = readCookie('AuthToken');
            var userid = readCookie('UserId');

            if (auth == null)
                auth = '00000000-0000-0000-0000-000000000000';
            if (userid == null || !$.isNumeric(userid))
                userid = '0';

            if (document.getElementById("txtAccuserComment").value === "") {
                alert('Please enter your comment.');
            }
            else if (userid == BlackuserId) {
                alert('you can not abuse yourself');
            }
            else {
                var obj = $(this).serializeObject();
                obj.AuthToken = auth;
                obj.UserId = userid;
                obj.BlacklistUserId = BlackuserId;
                obj.AbuseType = '';
                obj.Source = BlackList_source;
                obj.SourceId = BlackList_sourceId;
                obj.AccuserComment = document.getElementById("txtAccuserComment").value;

                obj = JSON.stringify(obj);

                $('#div_loadingMain').show();
                sendAjax('ReportAbuse', obj, Success_ReportUserByChat, Fail_ReportUserByChat)
            }
        }
        else {
            alert('Invalid Blacklist User')
        }

    }

    function Success_ReportUserByChat(msg) {
        try {

            $('#div_loadingMain').hide();
            if (msg.d == "1") {
                $('#div_loadingMain').hide();
                //$("#modelReportSpam").modal("close");
                $('#modelReportSpam').modal('toggle');
                alert('Report User Sucessfully!');
                GetUserChat();
                GetUserPost();
            }
            else if (msg.d == "-1") {
                alert('Please Login to report user!');
            }
            else if (msg.d == "2") {
                alert('you can not abuse yourself');
            }
            else {
                alert('Error!');
            }

        }
        catch (ex)
        { }
    }

    function Fail_ReportUserByChat(e) {
        $('#div_loadingMain').hide();
        $("#modelReportSpam").modal("close");
        //$("#modelReportSpam").dialog("close");
        alert("Error!");
        // window.location.href = 'Default.aspx';
    }

    function UploadPost() {
        var city = '', prov = '', county = '', country = '', zip = '';
        var message = $('#txt_postMsg').val();

        var auth = readCookie('AuthToken');
        if (auth == null || auth == undefined)
            auth = '00000000-0000-0000-0000-000000000000';

        var userid = readCookie('UserId');
        if (userid == null || !$.isNumeric(userid) || userid == undefined)
            userid = '0';

        var pic = readCookie('UserAvatar');
        var username = readCookie('Username');
        city = $('#hdn_city').val();

        prov = $('#hdn_prov').val();
        zip = $('#hdn_zip').val();
        country = $('#hdn_country').val();
        latlon = $('#hdn_latlon').val();

        if (message != '') {
            if (country != '') {

                var uploadType = $('#hdn_uploadType').val();
                var youtubeid = '';

                var fileUploader = null;

                if (uploadType == '1')
                    fileUploader = '#fu_PostImage';
                else if (uploadType == '2')
                    fileUploader = '#fu_PostVideo';
                else if (uploadType == '3') {
                    youtubeid = $('#hdn_youtubeId').val()
                }

                var postType = $('#ddl_postType option:selected').val();


                var xhr = new window.XMLHttpRequest();

                var data = new FormData();

                if (uploadType == '1' || uploadType == '2') {
                    var files = $(fileUploader).get(0).files;
                    for (var i = 0; i < files.length; i++) {
                        data.append(files[i].name, files[i]);
                    }
                }

                data.append('city', city);
                data.append('prov', prov);
                data.append('county', county);
                data.append('country', country);
                data.append('latlon', latlon);
                data.append('zip', zip);
                data.append('postMsg', message);
                data.append('uploadType', uploadType);
                data.append('youTubeId', youtubeid);
                data.append('postType', postType);

                xhr.upload.addEventListener("progress", function (evt) {
                    if (evt.lengthComputable) {
                        var progress = Math.round(evt.loaded * 100 / evt.total);
                        $("#fu_Post_progressbar").progressbar("value", progress);
                    }
                }, false);
                xhr.open("POST", "/UploadHandler.ashx");

                xhr.setRequestHeader("type", '1_postMsg2'); // For post Image
                xhr.setRequestHeader("auth", auth); // auth token
                xhr.setRequestHeader("userid", userid); // For login userid

                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                        $("#fu_Post_progressbar").progressbar({ value: 0 });
                        $('#div_fu_Post_progressbar').hide();

                        var result11223 = xhr.responseText;
                        // alert(result11223);
                        if (result11223 == "1") {
                            show_result('Post added Successfully!', 1);
                            resetPost();
                            GetUserPost();
                            LoadMarkerOnMap();

                        }
                        else if (result11223 == "2") {
                            show_result('Error! in Adding Post', 2);
                        }
                        else if (result11223 == "3") {
                            show_result('Error! Country should not be empty', 2);
                        }
                        else if (result11223 == "4") {
                            show_result('Error! Message should not be empty', 2);
                        }
                        else if (result11223.trim() == "") {
                            show_result('Upload canceled', 2);
                        }
                        else if (result11223 == "-1") {
                            show_result('Please Login to Post ', 2);

                        }
                        else {
                            show_result('Error! Post not added Successfully', 2);

                        }
                    }
                }
                xhr.send(data);
                $('#div_fu_Post_progressbar').show();

                try {
                    $("#fu_Post_progressbar").progressbar({
                        max: 100,
                        change: function (evt, ui) {
                            //$("#fu_Post_progresslabel").text($("#fu_Post_progressbar").progressbar("value") + "%");
                        },
                        complete: function (evt, ui) {
                            // alert('fade out');
                        }
                    });
                }
                catch (ex) {
                    // alert(ex);
                }


                $('#btn_cancelUpload').unbind('click');
                $('#btn_cancelUpload').click(function () {
                    xhr.abort();
                    $('#fu_PostImage').val('');
                });

            }
            else {
                alert('Location Error! ,Select again Any location by clicking on map');
            }

        }
        else {
            alert('Enter Post Msg.');
            $('#txt_postMsg').focus();
        }

    }

    function getFileExtension(name) {
        var found = name.lastIndexOf('.') + 1;
        return (found > 0 ? name.substr(found) : "");
    }

    function fn_showPostContentHtml(media, mediaSource) {
        var contentPost = '';
        if (media != '' && mediaSource != '') {

            if (media == '1') {
                contentPost = '<div style="width:100%;text-align:center;height:auto;overflow:hidden"> <img src="' + mediaSource + '" style="width:150px" /> </div>'
            }
            else if (media == '2') {
                var VExtension = getFileExtension(mediaSource);

                contentPost = '<div style="width:100%;text-align:center;height:auto;overflow:hidden"> <video muted autoplay="autoplay" controls="controls" style="border-radius: 15px; width:300px; height:300px">'
                contentPost += '<source src="' + mediaSource + '" type="video/' + VExtension + '">';
                contentPost += ' Your browser does not support the video tag.  </video> </div>';
            }
            else if (media == '3') {
                contentPost = '<div style="width:100%;text-align:center;height:auto;overflow:hidden"> '
                contentPost += '<iframe width="350" height="225" src="https://www.youtube.com/embed/' + mediaSource + '"></iframe>';
                contentPost += '</div>';
            }

        }
        return contentPost;
    }


    function fn_PostReplyWithPostId(postid) {
        var city = '', prov = '', county = '', country = '', zip = '';
        var message = $('#txtArea_replyPost_' + postid).val();

        var auth = readCookie('AuthToken');
        if (auth == null || auth == undefined)
            auth = '00000000-0000-0000-0000-000000000000';

        var userid = readCookie('UserId');
        if (userid == null || !$.isNumeric(userid) || userid == undefined)
            userid = '0';

        var pic = readCookie('UserAvatar');
        var username = readCookie('Username');
        city = $('#hdn_city').val();

        prov = $('#hdn_prov').val();
        zip = $('#hdn_zip').val();
        country = $('#hdn_country').val();
        latlon = $('#hdn_latlon').val();

        if (message != '') {

            var reply_userId = $('#btn_ReplyPost_' + postid).attr('data-userid');
            var reply_postId = $('#btn_ReplyPost_' + postid).attr('data-id');

            var postid_int = 0;
            if ($.isNumeric(reply_postId)) {
                postid_int = parseInt(reply_postId);
            }

            if ($.isNumeric(reply_userId) && parseInt(reply_userId) > 0) {

                if ($.isNumeric(reply_postId) && parseInt(reply_postId) > 0) {

                    var auth = readCookie('AuthToken');
                    var userid = readCookie('UserId');
                    var auth_username = readCookie("Username")
                    var auth_userAvatar = readCookie("UserAvatar")

                    if (auth == null)
                        auth = '00000000-0000-0000-0000-000000000000';
                    if (userid == null || !$.isNumeric(userid))
                        userid = '0';


                    var isPrivateMsg = $('#chk_isPrivate-replyPost_' + reply_postId).prop('checked');

                    var obj = $(this).serializeObject();
                    obj.AuthToken = auth;
                    obj.userId = userid;
                    obj.username = auth_username;
                    obj.city = city;
                    obj.state = prov;
                    obj.county = county;
                    obj.country = country;
                    obj.zip = zip;
                    obj.latlon = latlon;
                    obj.Message = message
                    obj.parentIdStr = reply_postId;
                    obj.parentType = 1; // for postid

                    if (isPrivateMsg == true)
                        obj.isPrivate = true;
                    else
                        obj.isPrivate = false;

                    obj = JSON.stringify(obj);

                    $('#div_loadingMain').show();
                    sendAjax('InsertPostMsg2_Reply', obj, Success_Replypost, Fail_ReplyPost);

                }
                else {
                    alert('Invalid Post');
                }

            }
            else {
                alert('Invalid post User');
            }

        }
        else {
            alert('Enter Post Msg.');
            $('#txtArea_replyPost_' + postid).focus();
        }

    }

    function Success_Replypost(res) {
        try {

            $('#div_loadingMain').hide();

            if ($.isNumeric(res.d.postid) && parseInt(res.d.postid) > 0) {


                if (res.d.msg == "1") {
                    $('#txtArea_replyPost_' + res.d.postid).val('');

                    if (res.d.isPrivate == true)
                        show_result('Sucessfully sent To Inbox!', 1);
                    else
                        show_result('Sucessfully Replied!', 1);

                    $('#txtArea_replyPost_' + res.d.postid).focus();
                    GetUserPostReplyByPostId(res.d.postid);
                }
                else if (res.d.msg == "-1") {
                    alert('Please Login to reply to post!');
                }
                else if (res.d.msg == "2") {
                    alert('Invalid Post User');
                }
                else if (res.d.msg == "3") {
                    alert('Invalid Post');
                }
                else {
                    alert('Error!');
                }
            }
        }
        catch (ex)
        { }
    }

    function Fail_ReplyPost(e) {
        $('#div_loadingMain').hide();
        //$("#modelReportSpam").dialog("close");
        //  alert("Error!");
        //  $("#div_modelPostReplies").modal("close");
        // window.location.href = 'Default.aspx';
    }



    function GetUserInbox() {

        clear_timer_getPost();

        var auth = readCookie('AuthToken');
        if (auth == null || auth == undefined)
            auth = '00000000-0000-0000-0000-000000000000';

        var userid = readCookie('UserId');
        if (userid == null || !$.isNumeric(userid) || userid == undefined)
            userid = '0';

        var pic = readCookie('UserAvatar');
        var username = readCookie('Username');
        var city = $('#hdn_city').val();
        var prov = $('#hdn_prov').val();
        var country = $('#hdn_country').val();


        var obj = $(this).serializeObject();
        obj.AuthToken = auth;
        obj.userId = userid;

        obj = JSON.stringify(obj);

        $('#div_loadingInbox').show();
        sendAjax("GetUserInboxMsg", obj, Success_GetInbox, Fail_GetInbox);


    }


    function Success_GetInbox(res) {
        $('#div_loadingInbox').hide();

        $('#ul_inboxContent').empty();
        if (res.d != null && res.d.length > 0) {
            $("#Inbox_template").tmpl(res.d).appendTo("#ul_inboxContent");

            var LUserId = readCookie("UserId");

            $(".btn_show_replyInbox").unbind('click');
            $(".btn_show_replyInbox").click(function () {

                var reply_userid = $(this).attr('data-userid');
                var reply_userimg = $(this).attr('data-userImg');
                var reply_username = $(this).attr('data-username');
                var reply_MsgId = $(this).attr('data-id');

                var display_div = $('#div_modelInboxReplies_' + reply_MsgId).css('display');

                $('.div_modelInboxReplies_class').hide();
                if (display_div == 'none') {
                    // alert('none1');
                    $('#div_modelInboxReplies_' + reply_MsgId).slideDown();


                    $('#btn_ReplyInbox_' + reply_MsgId).unbind('click');
                    $('#btn_ReplyInbox_' + reply_MsgId).click(function () {

                        var replyMsgId = $(this).attr('data-id');

                        fn_InboxReplyWithMsgId(reply_MsgId);

                    });

                    $('#txtArea_replyInbox_' + reply_MsgId).focus();

                }
                else {
                    $('#div_modelInboxReplies_' + reply_MsgId).slideUp();

                }



            });



        }
        else {
            $('#ul_inboxContent').html('<div style="width:100%;height:auto;overflow:hidden;text-align:center">No Message Found</div>');
        }

    }

    function Fail_GetInbox(res) {
        $('#div_loadingInbox').hide();
        clear_timer_getPost();
        // alert('Error loading Post!');
    }




    function fn_InboxReplyWithMsgId(msgid) {
        var city = '', prov = '', county = '', country = '', zip = '';
        var message = $('#txtArea_replyInbox_' + msgid).val();

        var auth = readCookie('AuthToken');
        if (auth == null || auth == undefined)
            auth = '00000000-0000-0000-0000-000000000000';

        var userid = readCookie('UserId');
        if (userid == null || !$.isNumeric(userid) || userid == undefined)
            userid = '0';

        var pic = readCookie('UserAvatar');
        var username = readCookie('Username');
        city = $('#hdn_city').val();

        prov = $('#hdn_prov').val();
        zip = $('#hdn_zip').val();
        country = $('#hdn_country').val();
        latlon = $('#hdn_latlon').val();

        if (message != '') {

            var reply_userId = $('#btn_ReplyInbox_' + msgid).attr('data-userid');
            var reply_msgId = $('#btn_ReplyInbox_' + msgid).attr('data-id');

            var msgid_int = 0;
            if ($.isNumeric(reply_msgId)) {
                msg_int = parseInt(reply_msgId);
            }

            if ($.isNumeric(reply_userId) && parseInt(reply_userId) > 0) {

                if ($.isNumeric(reply_msgId) && parseInt(reply_msgId) > 0) {

                    var auth = readCookie('AuthToken');
                    var userid = readCookie('UserId');
                    var auth_username = readCookie("Username")
                    var auth_userAvatar = readCookie("UserAvatar")

                    if (auth == null)
                        auth = '00000000-0000-0000-0000-000000000000';
                    if (userid == null || !$.isNumeric(userid))
                        userid = '0';


                    var isPrivateMsg = true;

                    var obj = $(this).serializeObject();
                    obj.AuthToken = auth;
                    obj.userId = userid;
                    obj.username = auth_username;
                    obj.city = city;
                    obj.state = prov;
                    obj.county = county;
                    obj.country = country;
                    obj.zip = zip;
                    obj.latlon = latlon;
                    obj.Message = message
                    obj.parentIdStr = reply_msgId;
                    obj.parentType = 2; // for inbox msgId

                    if (isPrivateMsg == true)
                        obj.isPrivate = true;
                    else
                        obj.isPrivate = false;

                    obj = JSON.stringify(obj);

                    $('#div_loadingMain').show();
                    sendAjax('InsertPostMsg2_Reply', obj, Success_ReplyInbox, Fail_ReplyInbox);

                }
                else {
                    alert('Invalid Message');
                }

            }
            else {
                alert('Invalid Message User');
            }

        }
        else {
            alert('Enter Reply Msg.');
            $('#txtArea_replyInbox_' + msgid).focus();
        }

    }

    function Success_ReplyInbox(res) {
        try {

            $('#div_loadingMain').hide();

            if ($.isNumeric(res.d.postid) && parseInt(res.d.postid) > 0) {


                if (res.d.msg == "1") {
                    $('#txtArea_replyInbox_' + res.d.postid).val('');

                    if (res.d.isPrivate == true)
                        show_result('Sucessfully sent To Inbox!', 1);
                    else
                        show_result('Sucessfully Replied!', 1);

                    $('#txtArea_replyInbox_' + res.d.postid).focus();
                    GetUserInbox();
                }
                else if (res.d.msg == "-1") {
                    alert('Please Login to reply to Post!');
                }
                else if (res.d.msg == "2") {
                    alert('Invalid Message User');
                }
                else if (res.d.msg == "3") {
                    alert('Invalid Message');
                }
                else {
                    alert('Error!');
                }
            }
        }
        catch (ex)
        { }
    }

    function Fail_ReplyInbox(e) {
        $('#div_loadingMain').hide();
        //$("#modelReportSpam").dialog("close");
        //  alert("Error!");
        //  $("#div_modelPostReplies").modal("close");
        // window.location.href = 'Default.aspx';
    }



    function deleteAllMarkersOnMap() {
        if (markers.length > 0) {
            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(null);
            }
        }

        markers = [];

    }


    function LoadMarkerOnMap() {

        var auth = readCookie('AuthToken');
        if (auth == null || auth == undefined)
            auth = '00000000-0000-0000-0000-000000000000';

        var userid = readCookie('UserId');
        if (userid == null || !$.isNumeric(userid) || userid == undefined)
            userid = '0';

        var pic = readCookie('UserAvatar');
        var username = readCookie('Username');
        var city = $('#hdn_city').val();
        var prov = $('#hdn_prov').val();
        var country = $('#hdn_country').val();

        var obj = $(this).serializeObject();
        obj.AuthToken = auth;
        obj.userId = userid;
        obj = JSON.stringify(obj);
        sendAjax("ShowMapIconUsingLatLong", obj, Success_ShowMapIconLatLong, Fail_ShowMapIconLatLong);

    }



    function Success_ShowMapIconLatLong(res) {
        try {

            deleteAllMarkersOnMap();

            if (res.d.lst_msg2.length > 0) {

                $.each(res.d.lst_msg2, function (i, v) {

                    // alert(v.lat + ' / ' + v.lng + ' / ' + v.type);

                    var postType = 'event';
                    var map_ico = 'marker_default.png';

                    if (v.type == '2') {
                        postType = 'info';
                        map_ico = 'marker_info.png';
                    }



                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(v.lat, v.lng),
                        icon: '/assets/image/' + map_ico,
                        map: map
                    });


                    //Add listener
                    google.maps.event.addListener(marker, "click", function (event) {
                        // alert(this.position);
                        // alert('latitude = ' + latitude + ' / ' + ' longitude : ' + longitude);
                        var latitude = this.position.lat();
                        var longitude = this.position.lng();


                        MapClicked(this.position, "users");

                        //open post tab and close other tabs
                        $('#li_post').addClass('active');
                        $('#li_chat').removeClass('active');
                        $('#li_edu').removeClass('active');
                        $('#li_inbox').removeClass('active');
                        $('#li_video').removeClass('active');
                        $('#li_setting').removeClass('active');

                        $('#tPost').show();
                        $('#tChat').hide();
                        $('#tVideo').hide();
                        $('#tEdu').hide();
                        $('#tInbox').hide();
                        $('#tSetting').hide();
                    


                    }); //end addListener

                    //add marker in marker list
                    markers.push(marker);

                });

            }

            if (res.d.lst_chat2.length > 0) {

                $.each(res.d.lst_chat2, function (i, v) {

                    // alert(v.lat + ' / ' + v.lng + ' / ' + v.type);

                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(v.lat, v.lng),
                        map: map
                    });


                    //Add listener
                    google.maps.event.addListener(marker, "click", function (event) {
                        // alert(this.position);

                        var latitude = this.position.lat();
                        var longitude = this.position.lng();


                        MapClicked(this.position, "users");

                        //open chat tab and close other tabs
                        $('#li_post').removeClass('active');
                        $('#li_chat').addClass('active');
                        $('#li_edu').removeClass('active');
                        $('#li_inbox').removeClass('active');
                        $('#li_video').removeClass('active');
                        $('#li_setting').removeClass('active');


                        $('#tPost').hide();
                        $('#tChat').show();
                        $('#tVideo').hide();
                        $('#tEdu').hide();
                        $('#tInbox').hide();
                        $('#tSetting').hide();

                    }); //end addListener

                    //add marker in marker list
                    markers.push(marker);

                });

            }
       

        //user markers
        if (res.d.lst_UserMarker.length > 0) {
           
            for (ini = 0; ini <= res.d.lst_UserMarker.length - 1; ini++) {
                var thismarker;
                try {

                    if (res.d.lst_UserMarker[ini].lat != ""
                        && res.d.lst_UserMarker[ini].lng != "") {

                        thismarker = new google.maps.Marker({
                            position: new google.maps.LatLng(
                                res.d.lst_UserMarker[ini].lat,
                                res.d.lst_UserMarker[ini].lng),
                            map: map,
                            icon: 'https://maps.google.com/mapfiles/ms/micons/man.png'
                        });

                    }
                    else
                    {

                        var adds = res.d.lst_UserMarker[ini].City + " " +
                            res.d.lst_UserMarker[ini].Prov + " " +
                            res.d.lst_UserMarker[ini].PostalCode + " " +
                            res.d.lst_UserMarker[ini].Country;

                        geocoder.geocode({ 'address': adds }, function (results, status) {
                            if (status == google.maps.GeocoderStatus.OK) {

                                thismarker = new google.maps.Marker({
                                    map: map,
                                    position: results[0].geometry.location,
                                    icon: 'http://maps.google.com/mapfiles/ms/micons/man.png'
                                });

                            } else {
                                //alert("Geocode was not successful for the following reason: " + status);
                            }
                        });
                    }
                    markers.push(thismarker);
                } catch (exc)
                {
                    continue;
                }
            }
        }

    }
    catch (ex)
    { }
}

function Fail_ShowMapIconLatLong(e) {

    //$("#modelReportSpam").dialog("close");
    //  alert("Error!");
    //  $("#div_modelPostReplies").modal("close");
    // window.location.href = 'Default.aspx';
}

function Fail_ShowMapIconLatLong(e) {
  
    //$("#modelReportSpam").dialog("close");
    //  alert("Error!");
    //  $("#div_modelPostReplies").modal("close");
    // window.location.href = 'Default.aspx';
}



var isRunning_fn_changePassword = false;
function fn_CallChangePassword()
{
    if (isRunning_fn_changePassword == false)
        fn_changePassword();
}


function fn_changePassword() {
  
    var oldP = $('#txt_oldP').val();
    var newP = $('#txt_newP').val();
    var newConP = $('#txt_newConP').val();

    var auth = readCookie('AuthToken');
    if (auth == null || auth == undefined)
        auth = '00000000-0000-0000-0000-000000000000';

    var userid = readCookie('UserId');
    if (userid == null || !$.isNumeric(userid) || userid == undefined)
        userid = '0';

 

    if (oldP != '' && newP != '' && newConP != '' && newP == newConP) {



        var auth = readCookie('AuthToken');
        var userid = readCookie('UserId');
        var auth_username = readCookie("Username")
        var auth_userAvatar = readCookie("UserAvatar")

        if (auth == null)
            auth = '00000000-0000-0000-0000-000000000000';
        if (userid == null || !$.isNumeric(userid))
            userid = '0';
 

        var obj = $(this).serializeObject();
        obj.AuthToken = auth;
        obj.UserId = userid;
        obj.OldPassword = oldP;
        obj.NewPassword = newP;
     
        obj = JSON.stringify(obj);

        isRunning_fn_changePassword = true;
        $('#div_loadingMain').show();
        sendAjax('ChangePassword', obj, Success_ChangePassword, Fail_ChangePassword);

    }
    else
    {
       

        if (oldP == '') {
            alert('Fill All Textbox');
            $('#txt_oldP').focus();
        }
        else if (newP == '') {
            alert('Fill All Textbox');
            $('#txt_newP').focus();
        }
        else if (newConP != newP) {
            alert('Password and Confirm Password not matched');
            $('#txt_newConP').focus();
        }
       
    }

}


function Success_ChangePassword(res) {
    try {
        $('#div_loadingMain').hide();
        isRunning_fn_changePassword = false;
        if(res.d == '1')
        {
            show_result('Password Chnages Successfully!', 1);
            $('#txt_oldP').val('');
            $('#txt_newP').val('');
            $('#txt_newConP').val('');

        }
        else if (res.d == '3') {
            alert('Old Password not match');
            $('#txt_oldP').focus();
        }
        else if (res.d == '2') {
            alert('Old Password and New Passwod should not be empty');
        }
        else if(res.d == '-1')
        {
            alert('Please Login to change Password');
        }
        else
        {
            alert('Errro in Password changing.');
        }
       
    }
    catch (ex)
    { }
}

function Fail_ChangePassword(res) {
    $('#div_loadingMain').hide();
    isRunning_fn_changePassword = false;
    alert(res.d);
    //$("#modelReportSpam").dialog("close");
    //  alert("Error!");
    //  $("#div_modelPostReplies").modal("close");
    // window.location.href = 'Default.aspx';
}


function UploadUserAvatar() {
    
    var auth = readCookie('AuthToken');
    if (auth == null || auth == undefined)
        auth = '00000000-0000-0000-0000-000000000000';

    var userid = readCookie('UserId');
    if (userid == null || !$.isNumeric(userid) || userid == undefined)
        userid = '0';

    var pic = readCookie('UserAvatar');
    var username = readCookie('Username');
 
           
         
    var xhr = new window.XMLHttpRequest();

    var data = new FormData();

    var files = $('#fu_userAvatar').get(0).files;
    for (var i = 0; i < files.length; i++) {
        data.append(files[i].name, files[i]);
        
    }
            

            
    xhr.upload.addEventListener("progress", function (evt) {
        if (evt.lengthComputable) {
            var progress = Math.round(evt.loaded * 100 / evt.total);
            $("#fu_userAvatar_progressbar").progressbar("value", progress);
        }
    }, false);
    xhr.open("POST", "/UploadHandler.ashx",true);

    xhr.setRequestHeader("type", '2_userAvatar'); // For user avatar
    xhr.setRequestHeader("auth", auth); // auth token
    xhr.setRequestHeader("userid", userid); // For login userid
   // xhr.send(data);

    xhr.onreadystatechange = function () {
        $('#fu_userAvatar').val('');
        if (xhr.readyState == 4) {

            try{
                $("#fu_userAvatar_progressbar").progressbar({ value: 0 });
                $('#div_fu_userAvatar_progressbar').hide();

                      
                      
                var resjson = $.parseJSON(xhr.responseText);

                var result11223 = resjson.res;
                var fileName = resjson.fileName;

                if (result11223 == "1") {
                    show_result('User Profile Changed Successfully!', 1);

                    createCookie("UserAvatar", fileName, 99);
                    $("#UserAvatarPic").attr('src', fileName).show();
                    $("#UserAvatarPic_setting").attr('src', fileName).show();

                }
                else if (result11223 == "2") {
                    show_result('Error! Image not found', 2);
                }
                else if (result11223 == "3") {
                    show_result('Error! Invalid Image Format', 2);
                }
                else if (result11223.trim() == "") {
                    show_result('Upload canceled', 2);
                }
                else if (result11223 == "-1") {
                    show_result('Please Login to chnage profile ', 2);

                }
                else {
                    show_result('Error! in changing profile', 2);

                }

            }
            catch(ex)
            {
                // alert(ex);
            }

        }
    }
    xhr.send(data);
    $('#div_fu_userAvatar_progressbar').show();

    try {
        $("#fu_userAvatar_progressbar").progressbar({
            max: 100,
            change: function (evt, ui) {
                //$("#fu_Post_progresslabel").text($("#fu_Post_progressbar").progressbar("value") + "%");
            },
            complete: function (evt, ui) {
                // alert('fade out');
            }
        });
    }
    catch (ex) {
        // alert(ex);
    }


    $('#btn_cancelUpload_userAvatar').unbind('click');
    $('#btn_cancelUpload_userAvatar').click(function () {
        xhr.abort();
        $('#fu_userAvatar').val('');
    });

     

}




var isRunning_fn_changeZipCode = false;
function fn_CallChangeZipCode() {
    if (isRunning_fn_changeZipCode == false)
        fn_changeZipCode();
}


function fn_changeZipCode() {

    var txt_zip = $('#txt_userZipCode').val();

    var auth = readCookie('AuthToken');
    if (auth == null || auth == undefined)
        auth = '00000000-0000-0000-0000-000000000000';

    var userid = readCookie('UserId');
    if (userid == null || !$.isNumeric(userid) || userid == undefined)
        userid = '0';



    if (txt_zip != '' && $.isNumeric(txt_zip)) {


        var obj = $(this).serializeObject();
        obj.AuthToken = auth;
        obj.UserId = userid;
        obj.Defaultzipcode = txt_zip;
        

        obj = JSON.stringify(obj);

        isRunning_fn_changeZipCode = true;
        $('#div_loadingMain').show();
        sendAjax('UpdateDefaultZipcode', obj, Success_ChangeZip, Fail_ChangeZip);

    }
    else {

        alert('Numeric Only!');
        $('#txt_userZipCode').focus();
    }

}


function Success_ChangeZip(res1) {
    try
    {
        $('#div_loadingMain').hide();
        isRunning_fn_changeZipCode = false;

       
        var resJson = $.parseJSON(res1.d);

        var result = resJson.res;
        var zipcode = resJson.zipcode;

      
        if (result == '1') {
            show_result('Zipcode Changed Successfully!', 1);

            createCookie("UserZipCode", zipcode, 99);

        }
        else if (result == '2') {
            alert('Invalid Zipcode');
            $('#txt_userZipCode').focus();
        }
        else if (result == '-1') {
            alert('Please Login to change Zipcode');
        }
        else {
            alert('Errro in Zip changing.');
        }

    }
    catch (ex)
    { }
}

function Fail_ChangeZip(res) {
    $('#div_loadingMain').hide();
    isRunning_fn_changeZipCode = false;
    alert(res.d);
    //$("#modelReportSpam").dialog("close");
    //  alert("Error!");
    //  $("#div_modelPostReplies").modal("close");
    // window.location.href = 'Default.aspx';
}



var isRunning_fn_changeBio = false;
function fn_CallChangeBio() {
    if (isRunning_fn_changeBio == false)
        fn_changeBio();
}


function fn_changeBio() {

    var txt_bio = $('#txbxPersonalBio').val();

    var auth = readCookie('AuthToken');
    if (auth == null || auth == undefined)
        auth = '00000000-0000-0000-0000-000000000000';

    var userid = readCookie('UserId');
    if (userid == null || !$.isNumeric(userid) || userid == undefined)
        userid = '0';



    if (txt_bio != '') {
        
        var obj = $(this).serializeObject();
        obj.AuthToken = auth;
        obj.UserId = userid;
        obj.Bio = txt_bio;
        obj.ShowBio = $("#reg_form_checkboxbio").is(":checked");


        obj = JSON.stringify(obj);

        isRunning_fn_changeBio = true;
        $('#div_loadingMain').show();
        sendAjax('UserPersonalProfile', obj, Success_ChangeBio, Fail_ChangeBio);

    }
    else {

        alert('Enter Bio!');
        $('#txbxPersonalBio').focus();
    }

}


function Success_ChangeBio(res1) {
    try {
        $('#div_loadingMain').hide();
        isRunning_fn_changeBio = false;

      
        var resJson = $.parseJSON(res1.d);

        var result = resJson.res;
        var isShow = resJson.isShow;
        var bio = resJson.bio;

        var isShowBioBool = false;
        if (isShow.toLowerCase() == 'true')
            isShowBioBool = true;

        if (result == '1') {
            show_result('Bio Update Successfully!', 1);

            createCookie("UserProfileBio", bio, 99);
            createCookie("UserProfileShowBio", isShowBioBool, 99);
        }
        else if (result == '2') {
            show_result('Invalid user!', 2);
        }
        else if (result == '-1') {
            alert('Please Login to update profile.');
        }
        else
        {
            alert('Errro in Updating Bio');
        }

    }
    catch (ex)
    {

        alert(ex);
    }
}

function Fail_ChangeBio(res) {
    $('#div_loadingMain').hide();
    isRunning_fn_changeBio = false;
    alert(res.d);
    //$("#modelReportSpam").dialog("close");
    //  alert("Error!");
    //  $("#div_modelPostReplies").modal("close");
    // window.location.href = 'Default.aspx';
}



//end funtion created by varun mahajan



