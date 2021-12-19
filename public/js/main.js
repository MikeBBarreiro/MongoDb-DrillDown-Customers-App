$(document).ready(function() {
    $('#fuzzysearcher > .input-group > input').on('keyup', function (e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            var value = $('#fuzzysearcher > .input-group > input').val();
            $('#fuzzysearcher > .input-group > input').val('');
            searchDataBase(value);
        }
    });

    fetchCustomers();
    // fetchJobs($("#accordionParent > .accordion-item:nth-child(1)").attr('id')); //Grab the first loaded Customer

    $('[data-toggle="tooltip"]').tooltip()
    
    $(document).on('click', '.validaitonErrorInput', function (e) {
        $(this).removeClass('validaitonErrorInput');
    });

    //We must watch the document for clicks, sense the HTML selected is programatically generated.
    $(document).on('click', '.accordion-item', function (e) {
        var id = $(this).attr('id');
        e.preventDefault();
        // console.log(e);
        fetchJobs(id);
    });
    
    $(document).on('click', '#createCustomer', function (e) {
        var customerName = $('#createCustomerName').val();
        var customerCode = $('#createCustomerCode').val();
        var customerCity = $('#createCustomerCity').val();
        var customerAddress = $('#createCustomerAddress').val();
        var customerZIP = $('#CreateCustomerZIP').val();
        var customerState = $('#CreateCustomerState').val();

        var a = [
            {'value': customerName, id: 'createCustomerName'},
            {'value': customerCode, id: 'createCustomerCode'},
            {'value': customerCity, id: 'createCustomerCity'},
            {'value': customerAddress, id: 'createCustomerAddress'},
            {'value': customerZIP, id: 'CreateCustomerZIP'},
            {'value': customerState, id: 'CreateCustomerState'}
        ];

        if(customerName.length === 0 || (customerCode.length === 0 || customerCode.length < 4)|| customerCity.length === 0 || (customerZIP.length === 0 || customerZIP.length < 4) || customerAddress.length === 0 || customerState.length === 0){
            const validate = a.filter((word, i) => {
                if (word.value.length === 0) {
                    return word.id;
                }
                if(word.value.length === 0 || word.value.length < 4 && word.id === 'createCustomerCode'){
                    return word.id;
                }
                if(word.value.length === 0 || word.value.length < 4 && word.id === 'CreateCustomerZIP'){
                    return word.id;
                }
            });
            for(var i = 0; i < validate.length; i++){
                $('#' + validate[i].id).addClass('validaitonErrorInput');
            };
        }else{
            if($('#createCustomerName').hasClass('validaitonErrorInput')) $('#createCustomerName').removeClass('validaitonErrorInput');
            if($('#createCustomerCode').hasClass('validaitonErrorInput')) $('#createCustomerCode').removeClass('validaitonErrorInput');
            if($('#createCustomerCity').hasClass('validaitonErrorInput')) $('#createCustomerCity').removeClass('validaitonErrorInput');
            if($('#createCustomerAddress').hasClass('validaitonErrorInput')) $('#createCustomerAddress').removeClass('validaitonErrorInput');
            if($('#CreateCustomerZIP').hasClass('validaitonErrorInput')) $('#CreateCustomerZIP').removeClass('validaitonErrorInput');
            if($('#CreateCustomerState').hasClass('validaitonErrorInput')) $('#CreateCustomerState').removeClass('validaitonErrorInput');
            createCustomer();
        }
    });

    $(document).on('click', '.customer-actions-container > button', function() {
        var idSelector = $(this).attr('id');
        var selectedAction = idSelector.split('-');
        
        if(selectedAction[0] === 'addJob'){
            $('#addAJob-Modal').modal('show');
            var customerSelected = $('#' + selectedAction[1] + '.accordion-item > .accordion-header > button > span:nth-child(2)').text();
            var modalContentHTML = '<button id="' + selectedAction[1] + '" style="margin: 10px;" class="submitNewJob btn btn-primary">Create job for ' + customerSelected + '</button>'
            $('#addAJob-Modal > .modal-dialog > .modal-content > .modal-body > .formBody').append(modalContentHTML);
        }else if(selectedAction[0] === 'editCustomer'){
            $('#editCustomerModal').modal('show');

            var address = $('.accordion-item#' + selectedAction[1] + ' > .accordion-collapse > .accordion-body > .customer-actions-container > .additionalCustomerInfoTable > tbody > tr > td:nth-child(1)').text();
            var city = $('.accordion-item#' + selectedAction[1] + ' > .accordion-collapse > .accordion-body > .customer-actions-container > .additionalCustomerInfoTable > tbody > tr > td:nth-child(2)').text();
            var state = $('.accordion-item#' + selectedAction[1] + ' > .accordion-collapse > .accordion-body > .customer-actions-container > .additionalCustomerInfoTable > tbody > tr > td:nth-child(3)').text();
            var zip = $('.accordion-item#' + selectedAction[1] + ' > .accordion-collapse > .accordion-body > .customer-actions-container > .additionalCustomerInfoTable > tbody > tr > td:nth-child(4)').text();
            var customerTitle = $('.accordion-item#' + selectedAction[1] + ' > .accordion-header > .accordion-button > .CustomerTitle').text();
            var customerCode = $('.accordion-item#' + selectedAction[1] + ' > .accordion-header > .accordion-button > .CustomerCode').text();

            $('#editCustomerName').val(customerTitle);
            $('#editCustomerCity').val(city.trim());
            $('#editCustomerAddress').val(address.split(',')[0].trim());
            $('#editCustomerZIP').val(zip.trim());
            $('#editCustomerState').val(state.trim());
            $('#editCustomerCode').val(customerCode.split(':')[1]);

            var customerEditBtn = '<button type="button" class="btn btn-primary" id="editCustomer" value="' + selectedAction[1] + '">Edit Customer</button>'
            $('.edit-customer-footer').append(customerEditBtn);
        }else{
            if (confirm('Are you sure you want to DELETE this Customer?')) {
                deleteCustomer(selectedAction[1]);
            }
            
        }
    })

    $(document).on('click', '#editCustomer', function(){
        var customerId = $(this).val();

        var customerTitle = $('#editCustomerName').val();
        var city = $('#editCustomerCity').val();
        var address = $('#editCustomerAddress').val();
        var zip = $('#editCustomerZIP').val();
        var state = $('#editCustomerState').val();

        var newObj = {
            name: customerTitle,
            address: address,
            city: city,
            state: state,
            zip: zip
        }

        editCustomer(customerId, newObj);
    });
    
    $(document).on('click', '#addHardware', function() {
        $('#addHardware-Modal').modal('show');
        var modalContentHTML = '<button id="' + $(this).attr('value') + '" style="margin: 10px;" class="submitNewHardware btn btn-primary">Add Hardware</button>'
        $('#addHardware-Modal > .modal-dialog > .modal-content > .modal-body > .formBody').append(modalContentHTML);
    });
    
    $(document).on('click', '.submitNewHardware',function () {
        var customerId = $('.mainTableForHardware').attr('id').split('hardwareTableCustomer')[1];
        createHardware($(this).attr('id'), customerId);
    });

    $(document).on('click', '.submitNewJob',function () {
        addJob($(this).attr('id'));
    });

    $(document).on('click', '.addCustomerBtn',function () {
        $('#creatCustomerModal').modal('show');
    });

    $(document).on('click', '.closeModalBtn',function () {
        if($('#addAJob-Modal > .modal-dialog > .modal-content > .modal-body > .formBody > button.submitNewJob')){
            $('#addAJob-Modal > .modal-dialog > .modal-content > .modal-body > .formBody > button.submitNewJob').remove()
        }
        if($('#addHardware-Modal > .modal-dialog > .modal-content > .modal-body > .formBody > button.submitNewHardware')){
            $('#addHardware-Modal > .modal-dialog > .modal-content > .modal-body > .formBody > button.submitNewHardware').remove()
        }
        if($('#editCustomerModal > .modal-dialog > .modal-content > .edit-customer-footer > button#editCustomer')){
            $('#editCustomerModal > .modal-dialog > .modal-content > .edit-customer-footer > button#editCustomer').remove()
        }
        $('.modal').modal("hide");
    });

    $(document).on('click', '.closeHardwareModalBtn',function () {
        if($('#addHardware-Modal > .modal-dialog > .modal-content > .modal-body > .formBody > button.submitNewHardware')){
            $('#addHardware-Modal > .modal-dialog > .modal-content > .modal-body > .formBody > button.submitNewHardware').remove()
        }
        $('.modalhardware').modal("hide");
    });
    
    $(document).on('hidden.bs.modal', function () {
        if($('#addAJob-Modal > .modal-dialog > .modal-content > .modal-body > .formBody > button.submitNewJob')){
            $('#addAJob-Modal > .modal-dialog > .modal-content > .modal-body > .formBody > button.submitNewJob').remove()
        }
        if($('#addHardware-Modal > .modal-dialog > .modal-content > .modal-body > .formBody > button.submitNewHardware')){
            $('#addHardware-Modal > .modal-dialog > .modal-content > .modal-body > .formBody > button.submitNewHardware').remove()
        }
        if($('#editCustomerModal > .modal-dialog > .modal-content > .edit-customer-footer > button#editCustomer')){
            $('#editCustomerModal > .modal-dialog > .modal-content > .edit-customer-footer > button#editCustomer').remove()
        }
    })
    
    $(document).on('click', '.jobSelect', function (e) {
        var tdClasses = $(this).attr('class').split('jobTd');
        var tdId = $(this).attr('id');
        renderHardwareDetails(tdClasses, tdId);
    });

    $(document).on('click', '.deleteJob', function (e) {
        var parentId = $(this).attr('id').split('-')[1];
        var jobId = $(this).attr('value');
        
        if (confirm('Are you sure you want to DELETE this job?')) {
            deleteAJob(jobId, parentId);
        } else {
            
        }
    });

    $(document).on('click', '.deleteHardware', function (e) {
        var parentId = $(this).attr('id').split('-')[1];
        var hardwareId = $(this).attr('value');
        deleteAHardware(hardwareId, parentId);
    });

    $(document).on('click', '.editJob', function (e) {
        var tdClasses = $(this).attr('class').split(' ');
        jobEdit(tdClasses)
    });

    $(document).on('click', '.cancelEditingJob', function(){
        var tdClasses = $(this).attr('class').split(' ')

        if( $('.dc.' + tdClasses[0])[0].outerText === 'Cancel'){
            $('.' + tdClasses[0] + '.dc').removeClass('cancelEditingJob');
            $('.' + tdClasses[0] + '.dc').addClass('deleteJob');
            $('.' + tdClasses[0] + '.dc').text('DELETE');
        }

        $('#jobRow' + tdClasses[0] + ' > .jobTd' + tdClasses[0] + ' > span').css('display', 'block');
        $('#jobRow' + tdClasses[0] + ' > .editJob').css('display', '');

        $('#jobRow' + tdClasses[0] + ' > .jobTd' + tdClasses[0] + ' > input').css('display', 'none');
        $('#jobRow' + tdClasses[0] + ' > .updateJob').css('display', 'none');
    });

    $(document).on('click', '.editHardware', function (e) {
        var tdClasses = $(this).attr('class').split(' ');
        hardwareEdit(tdClasses)
    });

    $(document).on('click', '.cancelEditingHardware', function(){
        var tdClasses = $(this).attr('class').split(' ')

        if( $('.dc.' + tdClasses[0])[0].outerText === 'Cancel'){
            $('.' + tdClasses[0] + '.dc').removeClass('cancelEditingHardware');
            $('.' + tdClasses[0] + '.dc').addClass('deleteHardware');
            $('.' + tdClasses[0] + '.dc').text('DELETE');
        };

        $('#hardwareRow' + tdClasses[0] + ' > .hardwareTd' + tdClasses[0] + ' > span').css('display', '');
        $('.hardwareSelect#' + tdClasses[0] + ' > span').css('display', ''); //for first TD
        $('#hardwareRow' + tdClasses[0] + ' > .editHardware').css('display', '');

        $('.hardwareSelect#' + tdClasses[0] + ' > input').css('display', 'none'); //for first TD
        $('#hardwareRow' + tdClasses[0] + ' > .hardwareTd' + tdClasses[0] + ' > input').css('display', 'none');
        $('#hardwareRow' + tdClasses[0] + ' > .updateHardware').css('display', 'none');
    });
    
    $(document).on('click', '.updateJob', function (e) {
        var tdClasses = $(this).attr('class').split(' ');
        var connectionAppVal = $('#jobRow' + tdClasses[1] + ' > .jobTd' + tdClasses[1] + ' > .connectionApp').val();
        var connectionNumVal = $('#jobRow' + tdClasses[1] + ' > .jobTd' + tdClasses[1] + ' > .connectionNum').val();
        var usernameVal = $('#jobRow' + tdClasses[1] + ' > .jobTd' + tdClasses[1] + ' > .username').val();
        var passwordVal = $('#jobRow' + tdClasses[1] + ' > .jobTd' + tdClasses[1] + ' > .password').val();
        var additionalInfoVal = $('#jobRow' + tdClasses[1] + ' > .jobTd' + tdClasses[1] + ' > .additionalInfo').val();
        var newObj = {
            connectionApp: connectionAppVal,
            connectionNum: connectionNumVal,
            username: usernameVal,
            password: passwordVal,
            additionalInfo: additionalInfoVal
        }
        updateEditedJob(tdClasses[1], newObj);
    });

    $(document).on('click', '.updateHardware', function (e) {
        var tdClasses = $(this).attr('class').split(' ');
        var hardwareName = $('#hardwareRow' + tdClasses[1] + ' > .hardwareTd' + tdClasses[1] + ' > .hardwareName').val();
        var hardwareDescription = $('#hardwareRow' + tdClasses[1] + ' > .hardwareTd' + tdClasses[1] + ' > .hardwareDescription').val();
        var ipAddress = $('#hardwareRow' + tdClasses[1] + ' > .hardwareTd' + tdClasses[1] + ' > .ipAddress').val();
        var subnetMask = $('#hardwareRow' + tdClasses[1] + ' > .hardwareTd' + tdClasses[1] + ' > .subnetMask').val();
        var defaultGateway = $('#hardwareRow' + tdClasses[1] + ' > .hardwareTd' + tdClasses[1] + ' > .defaultGateway').val();
        var hardwareUsername = $('#hardwareRow' + tdClasses[1] + ' > .hardwareTd' + tdClasses[1] + ' > .hardwareUsername').val();
        var hardwarePassword = $('#hardwareRow' + tdClasses[1] + ' > .hardwareTd' + tdClasses[1] + ' > .hardwarePassword').val();
        var newObj = {
            name: hardwareName,
            description: hardwareDescription,
            ipAddress: ipAddress,
            subnetMask: subnetMask,
            defaultGateway: defaultGateway,
            username: hardwareUsername,
            password: hardwarePassword
        }
        updateHardware(tdClasses[1], newObj);
    });
    
    $(document).on('click', '#submitFuzzySearch', function (e) {
        var value = $('#fuzzysearcher > .input-group > input').val();
        $('#fuzzysearcher > .input-group > input').val('');
        searchDataBase(value);
    });

    $(document).on('click', '#returnInitDom', function() {
        $('.accordion-item').css('display', '');
    });
});

function searchDataBase(value){

    $('.fa-circle-o-notch').removeClass('fadeLoader');

    var finishedResults = [];
    $('.accordion-item').css('display', 'none');
    $.ajax({
        method: 'POST',
        dateType: 'json',
        url: 'http://localhost:3000/fuzzySearchCustomers', //URL OR ENDPOINT
        data: {"search": value},
        success: function (res){
            $('.fa-circle-o-notch').addClass('fadeLoader');
            if(res){
                if(res.results.length > 0) finishedResults = [...res.results];
            }else if(res === 'ERROR!'){
                alert('error from server');
            }
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
            console.log('error')
        }
    }).then(() => {
        $.ajax({
            method: 'POST',
            dateType: 'json',
            url: 'http://localhost:3000/fuzzySearchJobs', //URL OR ENDPOINT
            data: {"search": value},
            success: function (res){
                if(res){
                    console.log(res);
                    if(res.results.length > 0) finishedResults = [...finishedResults,...res.results];
                    console.log(finishedResults);
                }
            },
            error: function (jqXHR, textStatus, errorThrown)
            {
                console.log('error')
            }
        }).done(() => {
            $('.accordion-item').each((index, item) => {
                for(var i = 0; i < finishedResults.length; i++){
                    if(finishedResults[i].code){
                        if($(item).attr('id') === finishedResults[i]._id){
                            $(item).css('display', '');
                        }
                    }else if(finishedResults[i].jobNumber){
                        if($(item).attr('id') === finishedResults[i].parentId){
                            $(item).css('display', '');
                        }
                    }
                    
                }
            });
        });
    });
}

function fetchCustomers() {
    if($('#needCustomers')) $('#needCustomers').remove();

    $.ajax({
        method: 'GET', //GET OR POST
        dateType: 'json',
        url: 'http://localhost:3000/getCustomers', //URL OR ENDPOINT
        success: function (res) {
            if(res && res.data !== undefined){
                var arr = res.data.reverse();
                
                $('.fa-circle-o-notch').addClass('fadeLoader');

                arr.forEach(function(data, i){
                    if(!$.cookie('customer' + arr[i]._id + '')){
                        $.cookie('customer' + arr[i]._id + '', JSON.stringify(arr[i]), {expires: 10});
                    }
                    
                    var showHide,
                        expaneded;
                    if(i > 0){
                        showHide = ''
                        expaneded = false
                    }else{
                        showHide = ' show'
                        expaneded = true
                    }
                    var accordianCustomerHTML = 
                        '<div class="animate__animated animate__fadeInLeft accordion-item" id="' + data._id + '">' +
                            '<h2 class="accordion-header" id="heading'+ i +'">' +
                                '<button style="padding: 0 1.5rem 0;" class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse'+ i +'" aria-expanded="' + expaneded + '" aria-controls="collapse'+ i +'">' +
                                    '<span class="CustomerCode" >CODE: ' + data.code + '</span>' +
                                    '<span class="CustomerTitle">'+ data.name +'</span>' +
                                '</button>'+
                            '</h2>'+
                            '<div id="collapse'+ i +'" class="accordion-collapse collapse" aria-labelledby="heading'+ i +'" data-bs-parent="#accordionParent">' +
                                '<div class="accordion-body">' +
                                    '<span class="bodyEmpty"></span>' +
                                    '<div class="customer-actions-container">' +
                                        '<table class="additionalCustomerInfoTable">' +
                                            '<tr>' +
                                                '<td>' + data.address + ', </td>' + 
                                                '<td> ' + data.city + '</td>' + 
                                                '<td> ' + data.state + '</td>' + 
                                                '<td> ' + data.zip + '</td>' + 
                                            '</tr>' +
                                        '</table>' +
                                        '<button id="addJob-' + data._id + '" class="btn btn-success">Add a Job</button>' +
                                        '<button id="editCustomer-' + data._id + '" class="btn btn-success">Edit Customer</button>' +
                                        '<button id="deleteCustomer-' + data._id + '" class="deleteACustomer btn btn-danger">Delete Customer</button>' +
                                    '</div>' +
                                    
                                    '<table class="mainTableForCustomer table table-dark table-striped table-hover" id="jobTable' + data._id + '">' +
                                        '<th>Job #</th>'+
                                        '<th>Connection Application</th>' +
                                        '<th>Connection #</th>' +
                                        '<th>User Name</th>' +
                                        '<th>Password</th>' +
                                        '<th>Additional Info</th>' +
                                        '<th></th>' +
                                        '<th></th>' +
                                    '</table>'+
                                '</div>' +
                            '</div>' +
                        '</div>'
                    $('#accordionParent').append(accordianCustomerHTML);
                });
            }else{
                $('#accordionParent').append('<h3 class="animate__animated animate__pulse" id="needCustomers" style="">You have no customers! Go ahead and add one.</h3>');
            }
            
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
            console.log('error')
        }
    });
}

function fetchJobs(id){
    if($('.accordion-item#' + id + ' > .accordion-collapse > .accordion-body > span')[0].className === 'bodyEmpty'){
        $.ajax({
            method: 'POST',
            dateType: 'json',
            url: 'http://localhost:3000/getJobByID', //URL OR ENDPOINT
            data: {"id": id},
            success: function (res){
                var response = JSON.parse(res);
                var newCookieObj;
                var a;
                // console.log(response.data);

                if($.cookie('customer' + id )){
                    if((JSON.parse($.cookie('customer' + id )).Customer && JSON.parse($.cookie('customer' + id )).Jobs) !==  undefined){
                        a = JSON.parse($.cookie('customer' + id)).Customer;
                        newCookieObj = {
                            Customer: a,
                            Jobs: JSON.parse(res).data
                        }  
                    }else{
                        a = JSON.parse($.cookie('customer' + id));
                        newCookieObj = {
                            Customer: a,
                            Jobs: JSON.parse(res).data
                        }  
                    }

                    $.removeCookie('customer' + id + '');
                    $.cookie('customer' + id + '', JSON.stringify(newCookieObj), {expires: 10});
                }

                response.data.forEach(function(data, i){
                    var jobTableRowHTML = 
                    '<tr id="jobRow' + data._id + '" class="' + id + '">' +
                        '<td class="' + id + ' jobSelect" id="' + data._id + '"><button class="jobSelectBtn btn" data-toggle="tooltip" data-placement="top" title="Select to view hardware">' + data.jobNumber + '</button></td>' +
                        '<td class="jobTd' + data._id + '"><span>' + data.connectionApp + '</span><input placeholder="' + data.connectionApp + '" value="' + data.connectionApp + '" class="connectionApp" style="display:none" /></td>' +
                        '<td class="jobTd' + data._id + '"><span>' + data.connectionNum + '</span><input placeholder="' + data.connectionNum + '" value="' + data.connectionNum + '" class="connectionNum" style="display:none" /></td>' +
                        '<td class="jobTd' + data._id + '"><span>' + data.username + '</span><input placeholder="' + data.username + '" value="' + data.username + '" class="username" style="display:none" /></td>' +
                        '<td class="jobTd' + data._id + '"><span>' + data.password + '</span><input placeholder="' + data.password + '" value="' + data.password + '"  class="password" style="display:none" /></td>' +
                        '<td class="jobTd' + data._id + '" style="white-space:nowrap;"><span>' + data.additionalInfo + '</span><input placeholder="' + data.additionalInfo + '" value="' + data.additionalInfo + '"  class="additionalInfo" style="display:none" /></td>' +
                        '<td class="deleteJob ' + data._id + ' dc" id="associatedUpper-' + id + '" value="' + data._id + '">DELETE</td>' +
                        '<td class="editJob ' + data._id + ' es">EDIT</td>' +
                        '<td style="display: none;" class="updateJob ' + data._id + '">SAVE</td>' +
                    '</tr>'
                    // $('.accordion-item#' + id + ' > .accordion-collapse > .accordion-body > span').removeClass('bodyEmpty');
                    
                    // $('#' + $('.accordion-item#' + id + '') + '> .accordion-collapse > .accordion-body > span').addClass('dataFufilled');
                    $('#jobTable' + data.parentId).append(jobTableRowHTML);
                });
                $('.accordion-item#' + id + '' + '> .accordion-collapse > .accordion-body > span').removeClass('bodyEmpty');
                $('.accordion-item#' + id + '' + '> .accordion-collapse > .accordion-body > span').addClass('dataFufilled');
                $('.tableLoader').css('display', 'none');
            },
            error: function (jqXHR, textStatus, errorThrown)
            {
                console.log('error')
            }
        });
    }else{
        console.log('data is already loaded, dont call again');
        return;
    }
}

function renderHardwareDetails(id, jobId){
    
    var parentId = id[0].split('jobSelect')[0].trim();
    if($.cookie('customer' + parentId )){
        var cookieData = JSON.parse($.cookie('customer' + parentId ));
    }
    for(var i = 0; i < cookieData.Jobs.length; i++){
        if(cookieData.Jobs[i]._id === jobId){
            var selectedJobDetails = cookieData.Jobs[i];
        }
    }

    var hardwareContent = 
        '<div class="modal-header">' +
            '<h5 class="modal-title" id="exampleModalLabel">' + cookieData.Customer.name + ' / ' + selectedJobDetails.jobNumber + ' / Hardware Information</h5>' +
            '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>' +
        '</div>' +
        '<div class="modal-body">' +
        '<button id="addHardware" value="' + selectedJobDetails._id + '" type="button" class="btn btn-success" style="margin-bottom: 15px;">Add Hardware</button>' +
        '<table class="mainTableForHardware table table-dark table-striped table-hover" id="hardwareTableCustomer' + cookieData.Customer._id + '" style="display: none;">' +
            `<tbody class="hardwareTbody">
                    <tr>
                        <th>Name</th>
                        <th>Description</td>
                        <th>IP Adress</th>
                        <th>Subnet Mask</th>
                        <th>Default Gateway</th>
                        <th>Username</th>
                        <th>Password</th>
                        <th></th>
                        <th></th>
                    </tr>
            </tbody>` +
        '</table>' +
        '<h3 id="noHardware">This Job does not have hardware yet</h3>' +
        '</div>' +
        '<div class="modal-footer">' +
            '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>' +
        '</div>';
    
    $('#myModal').find('.modal-content').html(hardwareContent);

    if(selectedJobDetails.hardware !== undefined){
        if(selectedJobDetails.hardware.length !== 0 ){
            $('#noHardware').remove();
            $('.mainTableForHardware').css('display', '');
            // $('.mainTableForHardware').remove();
            selectedJobDetails.hardware.forEach(function(data, i){
                var table = 
                `<tr id="hardwareRow`+ data._id +`">
                    <td class="hardwareTd` + data._id + `" id="` + data._id + `"><span>` + data.name + `</span><input placeholder="` + data.name + `" value="` + data.name + `" class="hardwareName" style="display:none"/></td>
                    <td class="hardwareTd` + data._id + `"><span>` + data.description + `</span><input placeholder="` + data.description + `" value="` + data.description + `" class="hardwareDescription" style="display:none"/></td>
                    <td class="hardwareTd` + data._id + `">
                        <span>` + data.ipAddress + `</span>
                        <input placeholder="` + data.ipAddress + `" value="` + data.ipAddress + `" class="ipAddress" style="display:none"  minlength="7" maxlength="15" size="15" pattern="^((\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$"/>
                    </td>
                    <td class="hardwareTd` + data._id + `">
                        <span>` + data.subnetMask + `</span>
                        <input placeholder="` + data.subnetMask + `" value="` + data.subnetMask + `" class="subnetMask" style="display:none"  minlength="7" maxlength="15" size="15" pattern="^((\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$"/>
                    </td>
                    <td class="hardwareTd` + data._id + `">
                        <span>` + data.defaultGateway + `</span>
                        <input placeholder="` + data.defaultGateway + `" value="` + data.defaultGateway + `" class="defaultGateway" style="display:none"  minlength="7" maxlength="15" size="15" pattern="^((\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$"/>
                    </td>
                    <td class="hardwareTd` + data._id + `"><span>` + data.username + `</span><input placeholder="` + data.username + `" value="` + data.username + `" class="hardwareUsername" style="display:none"/></td>
                    <td class="hardwareTd` + data._id + `"><span>` + data.password + `</span><input placeholder="` + data.password + `" value="` + data.password + `" class="hardwarePassword" style="display:none"/></td>
                    <td class="deleteHardware ` + data._id + ` dc" id="associatedUpper-` + selectedJobDetails._id + `" value="` + data._id + `">DELETE</td>
                    <td class="editHardware ` + data._id + ` es" value="` + data._id + `">EDIT</td>
                    <td style="display: none;" class="updateHardware ` + data._id + `">SAVE</td>
                </tr>`;
                $('.hardwareTbody').append(table);
            });
        }
    }else{
        // $('.mainTableForHardware').append(table);
    }
    $('#exampleModal').modal('show');
}

function jobEdit(tdClasses){
    $('.deleteJob.' + tdClasses[1]).text('Cancel');
    $('.deleteJob.' + tdClasses[1]).addClass('cancelEditingJob');
    $('.' + tdClasses[1] + '.dc').removeClass('deleteJob');

    $('#jobRow' + tdClasses[1] + ' > .jobTd' + tdClasses[1] + ' > input').css('display', 'block');
    $('#jobRow' + tdClasses[1] + ' > .jobTd' + tdClasses[1] + ' > span').css('display', 'none');
    $('#jobRow' + tdClasses[1] + ' > .editJob').css('display', 'none');

    $('#jobRow' + tdClasses[1] + ' > .jobTd' + tdClasses[1] + ' > input').css('display', 'block');
    $('#jobRow' + tdClasses[1] + ' > .updateJob').css('display', 'revert');
}

function updateEditedJob(jobId, updatedObj){
    $.ajax({
        method: 'PUT',
        dateType: 'json',
        url: 'http://localhost:3000/updateJob',
        data: {"id": jobId, updatedJob: updatedObj},
        success: function (res){
            if(res){
                var dataResponse = JSON.parse(res);

                $('#jobRow' + jobId + ' > td.jobTd' + jobId + ':nth-child(2) > span').text(dataResponse.updatedData.connectionApp);
                $('#jobRow' + jobId + ' > td.jobTd' + jobId + ':nth-child(3) > span').text(dataResponse.updatedData.connectionNum);
                $('#jobRow' + jobId + ' > td.jobTd' + jobId + ':nth-child(4) > span').text(dataResponse.updatedData.username);
                $('#jobRow' + jobId + ' > td.jobTd' + jobId + ':nth-child(5) > span').text(dataResponse.updatedData.password);
                $('#jobRow' + jobId + ' > td.jobTd' + jobId + ':nth-child(6) > span').text(dataResponse.updatedData.additionalInfo);
    
                $('.' + jobId + '.dc').addClass('deleteJob');
                $('.deleteJob.' + jobId).text('DELETE');
                $('.deleteJob.' + jobId).removeClass('cancelEditingJob');
                
                $('#jobRow' + jobId + ' > .jobTd' + jobId + ' > span').css('display', '');
                $('#jobRow' + jobId + ' > .editJob').css('display', '');
    
                $('#jobRow' + jobId + ' > .jobTd' + jobId + ' > input').css('display', 'none');
                $('#jobRow' + jobId + ' > .updateJob').css('display', 'none');
                var toastLiveExample = document.getElementById('liveToast');
                var toast = new bootstrap.Toast(toastLiveExample)
                toast.show();
            }
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
            console.log('error')
        }
    });
}

function editCustomer(customerId, updatedObj){
    console.log(customerId);
    console.log(updatedObj);
    $.ajax({
        method: 'PUT',
        dateType: 'json',
        url: 'http://localhost:3000/updateCustomer',
        data: {"id": customerId, "updatedObj": updatedObj},
        success: function (res){
            if(res){
                var data = JSON.parse(res);

                $('.accordion-item#' + customerId + ' > .accordion-header > .accordion-button > .CustomerTitle').text(data.updatedData.name);
                $('.accordion-item#' + customerId + ' > .accordion-collapse > .accordion-body > .customer-actions-container > .additionalCustomerInfoTable > tbody > tr > td:nth-child(1)').text(data.updatedData.address);
                $('.accordion-item#' + customerId + ' > .accordion-collapse > .accordion-body > .customer-actions-container > .additionalCustomerInfoTable > tbody > tr > td:nth-child(2)').text(data.updatedData.city);
                $('.accordion-item#' + customerId + ' > .accordion-collapse > .accordion-body > .customer-actions-container > .additionalCustomerInfoTable > tbody > tr > td:nth-child(3)').text(data.updatedData.state);
                $('.accordion-item#' + customerId + ' > .accordion-collapse > .accordion-body > .customer-actions-container > .additionalCustomerInfoTable > tbody > tr > td:nth-child(4)').text(data.updatedData.zip);

                $('#editCustomerModal').modal("hide");
                var toastLiveExample = document.getElementById('liveToast');
                var toast = new bootstrap.Toast(toastLiveExample)
                toast.show();
            }
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
            console.log(textStatus);
            console.log('error');
        }
    });
}

function updateHardware(hardwareId, updatedHardware){
    $.ajax({
        method: 'PUT',
        dateType: 'json',
        url: 'http://localhost:3000/updateHardware', //URL OR ENDPOINT
        data: {"id": hardwareId, updatedHardware: updatedHardware},
        success: function (res){
            if(res){
                var dataResponse = JSON.parse(res);

                $('#hardwareRow' + hardwareId + ' > td.hardwareTd' + hardwareId + ':nth-child(1) > span').text(dataResponse.updatedData.name);
                $('#hardwareRow' + hardwareId + ' > td.hardwareTd' + hardwareId + ':nth-child(2) > span').text(dataResponse.updatedData.description);
                $('#hardwareRow' + hardwareId + ' > td.hardwareTd' + hardwareId + ':nth-child(3) > span').text(dataResponse.updatedData.ipAddress);
                $('#hardwareRow' + hardwareId + ' > td.hardwareTd' + hardwareId + ':nth-child(4) > span').text(dataResponse.updatedData.subnetMask);
                $('#hardwareRow' + hardwareId + ' > td.hardwareTd' + hardwareId + ':nth-child(5) > span').text(dataResponse.updatedData.defaultGateway);
                $('#hardwareRow' + hardwareId + ' > td.hardwareTd' + hardwareId + ':nth-child(6) > span').text(dataResponse.updatedData.username);
                $('#hardwareRow' + hardwareId + ' > td.hardwareTd' + hardwareId + ':nth-child(7) > span').text(dataResponse.updatedData.password);
    
                $('.' + hardwareId + '.dc').addClass('deleteJob');
                $('.deleteJob.' + hardwareId).text('DELETE');
                $('.deleteJob.' + hardwareId).removeClass('cancelEditingHardware');
                
                $('#hardwareRow' + hardwareId + ' > .hardwareTd' + hardwareId + ' > span').css('display', '');
                $('#hardwareRow' + hardwareId + ' > .editJob').css('display', '');
    
                $('#hardwareRow' + hardwareId + ' > .hardwareTd' + hardwareId + ' > input').css('display', 'none');
                $('#hardwareRow' + hardwareId + ' > .updateJob').css('display', 'none');
                var toastLiveExample = document.getElementById('liveToast');
                var toast = new bootstrap.Toast(toastLiveExample)
                toast.show();
            }
            // var response = JSON.parse(res);
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
            console.log('error')
        }
    });
}

function hardwareEdit(tdClasses){
    $('.deleteHardware.' + tdClasses[1]).text('Cancel');
    $('.deleteHardware.' + tdClasses[1]).addClass('cancelEditingHardware');
    $('.' + tdClasses[1] + '.dc').removeClass('deleteHardware');

    $('#hardwareRow' + tdClasses[1] + ' > .hardwareTd' + tdClasses[1] + ' > span').css('display', 'none');
    $('.hardwareSelect#' + tdClasses[1] + ' > span').css('display', 'none'); //for first TD
    $('#hardwareRow' + tdClasses[1] + ' > .editHardware').css('display', 'none');

    $('.hardwareSelect#' + tdClasses[1] + ' > input').css('display', 'block'); //for first TD
    $('#hardwareRow' + tdClasses[1] + ' > .hardwareTd' + tdClasses[1] + ' > input').css('display', 'block');
    $('#hardwareRow' + tdClasses[1] + ' > .updateHardware').css('display', 'revert');
}

function addJob(id){

    var JobNumberValue = $('#addJobJobNumber').val();
    var ConnectionNumberValue = $('#addJobConnectionNumber').val();
    var ConnectionApplicationValue = $('#addJobConnectionApplication').val();
    var UsernameValue = $('#addJobUsername').val();
    var PasswordValue = $('#addJobPassword').val();
    var AdditionalInforValue = $('#addJobAdditionalInformation').val();

    var a = [
        {'value': JobNumberValue, id: 'addJobJobNumber'},
        {'value': ConnectionNumberValue, id: 'addJobConnectionNumber'},
        {'value': ConnectionApplicationValue, id: 'addJobConnectionApplication'},
        {'value': UsernameValue, id: 'addJobUsername'},
        {'value': PasswordValue, id: 'addJobPassword'},
        {'value': AdditionalInforValue, id: 'addJobAdditionalInformation'}
    ];

    if(ConnectionNumberValue.length === 0 
        || (JobNumberValue.length === 0 || JobNumberValue.length < 4)
        || ConnectionApplicationValue.length === 0 
        || AdditionalInforValue.length === 0
        || UsernameValue.length === 0 
        || PasswordValue.length === 0){
        const validate = a.filter((word, i) => {
            if (word.value.length === 0) {
                return word.id;
            }
            if(word.value.length === 0 || word.value.length < 4 && word.id === 'addJobJobNumber'){
                return word.id;
            }
        });
        for(var i = 0; i < validate.length; i++){
            $('#' + validate[i].id).addClass('validaitonErrorInput');
        };
        return;
    }else{
        if($('#addJobJobNumber').hasClass('validaitonErrorInput')) $('#addJobJobNumber').removeClass('validaitonErrorInput');
        if($('#addJobConnectionNumber').hasClass('validaitonErrorInput')) $('#addJobConnectionNumber').removeClass('validaitonErrorInput');
        if($('#addJobConnectionApplication').hasClass('validaitonErrorInput')) $('#addJobConnectionApplication').removeClass('validaitonErrorInput');
        if($('#addJobUsername').hasClass('validaitonErrorInput')) $('#addJobUsername').removeClass('validaitonErrorInput');
        if($('#addJobPassword').hasClass('validaitonErrorInput')) $('#addJobPassword').removeClass('validaitonErrorInput');
        if($('#addJobAdditionalInformation').hasClass('validaitonErrorInput')) $('#addJobAdditionalInformation').removeClass('validaitonErrorInput');
    }

    obj = {
        jobNumber: JobNumberValue,
        connectionApp: ConnectionApplicationValue,
        connectionNum: ConnectionNumberValue,
        username: UsernameValue,
        password: PasswordValue,
        additionalInfo: AdditionalInforValue,
        parentId: id,
        hardware: []
    }

    $.ajax({
        method: 'POST',
        dateType: 'json',
        url: 'http://localhost:3000/addAJob',
        data: {"obj": obj},
        success: function (res){
            var toastLiveExample = document.getElementById('liveToast');
            if(res !== 'ERROR!'){
                data = JSON.parse(res);

                var newObject = {
                    ...JSON.parse($.cookie('customer' + data.parentId))
                }

                newObject.Jobs.push(data);

                //update the existing cookie with the new data.
                $.cookie('customer' + data.parentId, JSON.stringify(newObject), {expires: 10});
                
                $('.modal').modal("hide");
                var toast = new bootstrap.Toast(toastLiveExample);
                toast.show();
                
                var jobTableRowHTML = 
                    '<tr id="jobRow' + data.jobId + '" class="' + data.parentId + '">' +
                        '<td class="' + data.parentId + ' jobSelect"><button class="jobSelectBtn btn" data-toggle="tooltip" data-placement="top" title="Select to view hardware">' + data.jobNumber + '</button></td>' +
                        '<td class="jobTd' + data.jobId + '"><span>' + data.connectionApp + '</span><input placeholder="' + data.connectionApp + '" value="' + data.connectionApp + '" class="connectionApp" style="display:none" /></td>' +
                        '<td class="jobTd' + data.jobId + '"><span>' + data.connectionNum + '</span><input placeholder="' + data.connectionNum + '" value="' + data.connectionNum + '" class="connectionNum" style="display:none" /></td>' +
                        '<td class="jobTd' + data.jobId + '"><span>' + data.username + '</span><input placeholder="' + data.username + '" value="' + data.username + '" class="username" style="display:none" /></td>' +
                        '<td class="jobTd' + data.jobId + '"><span>' + data.password + '</span><input placeholder="' + data.password + '" value="' + data.password + '"  class="password" style="display:none" /></td>' +
                        '<td class="jobTd' + data.jobId + '" style="white-space:nowrap;"><span>' + data.additionalInfo + '</span><input placeholder="' + data.additionalInfo + '" value="' + data.additionalInfo + '"  class="additionalInfo" style="display:none" /></td>' +
                        '<td class="deleteJob ' + data.jobId + ' dc" id="associatedUpper-' + data.parentId + '" value="' + data.jobId + '">DELETE</td>' +
                        '<td class="editJob ' + data.jobId + ' es" value="' + data.jobId + '">EDIT</td>' +
                        '<td style="display: none;" class="updateJob ' + data.jobId + '">SAVE</td>' +
                    '</tr>'
                    
                    $('#addJobJobNumber').val('');
                    $('#addJobConnectionNumber').val('');
                    $('#addJobConnectionApplication').val('');
                    $('#addJobUsername').val('');
                    $('#addJobPassword').val('');
                    $('#addJobAdditionalInformation').val('');

                    $('#jobTable' + data.parentId).append(jobTableRowHTML);
            }else{
                $('.modal').modal("hide");
                var toastLiveExampleERROR = document.getElementById('liveToastERROR');
                var toasterror = new bootstrap.Toast(toastLiveExampleERROR)
                toasterror.show();
            };
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
            $('.modal').modal("hide");
            var toastLiveExampleERROR = document.getElementById('liveToastERROR');
            var toasterror = new bootstrap.Toast(toastLiveExampleERROR)
            toasterror.show();
        }
    });
}

function deleteAJob(jobId, parentId){
    $.ajax({
        method: 'DELETE',
        dateType: 'json',
        url: 'http://localhost:3000/deleteJobById',
        data: {"id": jobId, "customerId": parentId},
        success: function (res){

            var toastLiveExample = document.getElementById('liveToast');
            if(res !== 'ERROR!'){
                var toast = new bootstrap.Toast(toastLiveExample);
                toast.show();
                $("#jobRow" + jobId).remove(); //remove the row from the table's DOM.
            }else{
                var toastLiveExampleERROR = document.getElementById('liveToastERROR');
                var toasterror = new bootstrap.Toast(toastLiveExampleERROR)
                toasterror.show();
            };
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
            var toastLiveExampleERROR = document.getElementById('liveToastERROR');
            var toasterror = new bootstrap.Toast(toastLiveExampleERROR)
            toasterror.show();
        }
    });
}

function createHardware(jobId, customerId){
    var NameValue = $('#addHardwareName').val();
    var IpAddressValue = $('#addHardwareIPAddress').val();
    var SubnetMaskValue = $('#addHardwareSubnetMask').val();
    var DefaultGatewayValue = $('#addHardwareDefaultGateway').val();
    var UsernameValue = $('#addHardwareUsername').val();
    var PasswordValue = $('#addHardwarePassword').val();
    var DescriptionValue = $('#addHardwareDescription').val();

    var a = [
        {'value': NameValue, id: 'addHardwareName'},
        {'value': IpAddressValue, id: 'addHardwareIPAddress'},
        {'value': SubnetMaskValue, id: 'addHardwareSubnetMask'},
        {'value': DefaultGatewayValue, id: 'addHardwareDefaultGateway'},
        {'value': UsernameValue, id: 'addHardwareUsername'},
        {'value': PasswordValue, id: 'addHardwarePassword'},
        {'value': DescriptionValue, id: 'addHardwareDescription'}
    ];

    if(NameValue.length === 0 
        || (IpAddressValue.length < 7 || IpAddressValue.length > 15)
        || (SubnetMaskValue.length < 7 || SubnetMaskValue.length > 15)
        || (DefaultGatewayValue.length < 7 || DefaultGatewayValue.length > 15)
        || UsernameValue.length === 0 
        || PasswordValue.length === 0
        || DescriptionValue.length === 0){
        const validate = a.filter((word, i) => {
            if (word.value.length === 0) { return word.id; }
            if(word.id === 'addHardwareIPAddress' || word.id === 'addHardwareSubnetMask' || word.id === 'addHardwareDefaultGateway'){
                let regex = /\b((?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:\b|\.)){4}/g;
                // /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/ - looks promising
                // ((\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$ -- maybe working
                if(regex.test(word.value) !== true){
                    return word.id;
                }else{
                    return false;
                }
            }
        });
        for(var i = 0; i < validate.length; i++){
            $('#' + validate[i].id).addClass('validaitonErrorInput');
        };
        return;
    }else{
        if($('#addHardwareName').hasClass('validaitonErrorInput')) $('#addHardwareName').removeClass('validaitonErrorInput');
        if($('#addHardwareIPAddress').hasClass('validaitonErrorInput')) $('#addHardwareIPAddress').removeClass('validaitonErrorInput');
        if($('#addHardwareSubnetMask').hasClass('validaitonErrorInput')) $('#addHardwareSubnetMask').removeClass('validaitonErrorInput');
        if($('#addHardwareDefaultGateway').hasClass('validaitonErrorInput')) $('#addHardwareDefaultGateway').removeClass('validaitonErrorInput');
        if($('#addHardwareUsername').hasClass('validaitonErrorInput')) $('#addHardwareUsername').removeClass('validaitonErrorInput');
        if($('#addHardwareDescription').hasClass('validaitonErrorInput')) $('#addHardwareDescription').removeClass('validaitonErrorInput');
    }

    var obj = {
        name: NameValue,
        ipAddress: IpAddressValue,
        subnetMask: SubnetMaskValue,
        defaultGateway: DefaultGatewayValue,
        username: UsernameValue,
        password: PasswordValue,
        description: DescriptionValue,
        parentId: jobId
    }
    // console.log(obj);

    $.ajax({
        method: 'POST',
        dateType: 'json',
        url: 'http://localhost:3000/addHardware',
        data: {"obj": obj},
        success: function (res){
            var toastLiveExample = document.getElementById('liveToast');
            if(res !== 'ERROR!'){

                //Update the existing Customer cahced data on the spot.
                if($.cookie('customer' + customerId)){
                    var customerCookie = JSON.parse($.cookie('customer' + customerId));
                    for(var i = 0; i < customerCookie.Jobs.length; i++){
                        if(customerCookie.Jobs[i]._id === res.data.parentId){
                            customerCookie.Jobs[i].hardware.push(res.data);
                        }
                    }
                    $.cookie('customer' + customerId, JSON.stringify(customerCookie), {expires: 10});
                }
                
                $('.modalhardware').modal("hide");
                var toast = new bootstrap.Toast(toastLiveExample);
                toast.show();

                var hardwareTableRowHTML = 
                `<tr id="hardwareRow`+ res.data._id +`">
                    <td class="hardwareTd` + res.data._id + `" id="` + res.data._id + `"><span>` + res.data.name + `</span><input placeholder="` + res.data.name + `" value="` + res.data.name + `" class="ipAddress" style="display:none"/></td>
                    <td class="hardwareTd` + res.data._id + `"><span>` + res.data.description + `</span><input placeholder="` + res.data.description + `" value="` + res.data.description + `" class="description" style="display:none"/></td>
                    <td class="hardwareTd` + res.data._id + `"><span>` + res.data.ipAddress + `</span><input placeholder="` + res.data.ipAddress + `" value="` + res.data.ipAddress + `" class="ipAddress" style="display:none"/></td>
                    <td class="hardwareTd` + res.data._id + `"><span>` + res.data.subnetMask + `</span><input placeholder="` + res.data.subnetMask + `" value="` + res.data.subnetMask + `" class="subnetMask" style="display:none"/></td>
                    <td class="hardwareTd` + res.data._id + `"><span>` + res.data.defaultGateway + `</span><input placeholder="` + res.data.defaultGateway + `" value="` + res.data.defaultGateway + `" class="defaultGateway" style="display:none"/></td>
                    <td class="hardwareTd` + res.data._id + `"><span>` + res.data.username + `</span><input placeholder="` + res.data.username + `" value="` + res.data.username + `" class="hardwareUsername" style="display:none"/></td>
                    <td class="hardwareTd` + res.data._id + `"><span>` + res.data.password + `</span><input placeholder="` + res.data.password + `" value="` + res.data.password + `" class="hardwarePassword" style="display:none"/></td>
                    <td class="deleteHardware ` + res.data._id + ` dc" id="associatedUpper-` + customerId + `" value="` + res.data._id + `">DELETE</td>
                    <td class="editHardware ` + res.data._id + ` es" value="` + res.data._id + `">EDIT</td>
                    <td style="display: none;" class="updateHardware ` + res.data._id + `">SAVE</td>
                </tr>`;
                
                //append new hardware to the table.
                $('.hardwareTbody').append(hardwareTableRowHTML);
                
                $('#noHardware').remove();
                $('.mainTableForHardware').css('display', '');

                // clear input fields.
                $('#addHardwareName').val('');
                $('#addHardwareIPAddress').val('');
                $('#addHardwareSubnetMask').val('');
                $('#addHardwareDefaultGateway').val('');
                $('#addHardwareUsername').val('');
                $('#addHardwarePassword').val('');
                $('#addHardwareDescription').val('');

            }else{
                $('.modalhardware').modal("hide");
                var toastLiveExampleERROR = document.getElementById('liveToastERROR');
                var toasterror = new bootstrap.Toast(toastLiveExampleERROR)
                toasterror.show();
            };
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
            $('.modal').modal("hide");
            var toastLiveExampleERROR = document.getElementById('liveToastERROR');
            var toasterror = new bootstrap.Toast(toastLiveExampleERROR)
            toasterror.show();
        }
    });
}

function deleteAHardware(hardwareId, parentId){
    $.ajax({
        method: 'DELETE',
        dateType: 'json',
        url: 'http://localhost:3000/deleteHardwareById',
        data: {"jobId": parentId, "hardwareId": hardwareId},
        success: function (res){
            const customerId = $('.mainTableForHardware').attr('id').split('hardwareTableCustomer')[1];

            //Find the Job selected, then find the hardware within the job to remove it for the cookies to be updated.
            if($.cookie('customer' + customerId)){
                var customerCookie = JSON.parse($.cookie('customer' + customerId));

                customerCookie.Jobs.filter((job, index) => {
                    if(job._id === parentId){
                      for(var i = 0; i < job.hardware.length; i++){
                        if(job.hardware[i]._id === hardwareId){
                            customerCookie.Jobs[index].hardware.splice(i, 1);
                            $.cookie('customer' + customerId, JSON.stringify(customerCookie), {expires: 10});
                        }
                      }
                    }
                 });

                $.cookie('customer' + customerId, JSON.stringify(customerCookie), {expires: 10});
            }

            var toastLiveExample = document.getElementById('liveToast');
            if(res !== 'ERROR!'){
                var toast = new bootstrap.Toast(toastLiveExample);
                toast.show();
                $("#hardwareRow" + hardwareId).remove(); //remove the row from the table's DOM.
            }else{
                var toastLiveExampleERROR = document.getElementById('liveToastERROR');
                var toasterror = new bootstrap.Toast(toastLiveExampleERROR)
                toasterror.show();
            };
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
            var toastLiveExampleERROR = document.getElementById('liveToastERROR');
            var toasterror = new bootstrap.Toast(toastLiveExampleERROR)
            toasterror.show();
        }
    });
}

function createCustomer(){
    if($('#needCustomers')) $('#needCustomers').remove();

    var customerName = $('#createCustomerName').val();
    var customerCode = $('#createCustomerCode').val();
    var customerCity = $('#createCustomerCity').val();
    var customerAddress = $('#createCustomerAddress').val();
    var customerZIP = $('#CreateCustomerZIP').val();
    var customerState = $('#CreateCustomerState').val();

    var obj = {
        name: customerName,
        code: customerCode,
        city: customerCity,
        address: customerAddress,
        zip: customerZIP,
        state: customerState
    }

    $.ajax({
        method: 'POST',
        dateType: 'json',
        url: 'http://localhost:3000/createCustomer', //URL OR ENDPOINT
        data: {"obj": obj},
        success: function (res){
            var data = JSON.parse(res);
            console.log(res);
            
            $.cookie('customer' + data._id + '', JSON.stringify(data), {expires: 10});

            //TODO BUILD THIS LOGIC VVVVVVVVV
            // if(data.Jobs.length === 0){
            //     var jobSection = '<h3 id="noJobs">This customer has no jobs</h3>'
            // }else{
            //     var jobSection = 
            //     '<th>Job #</th>'+
            //     '<th>Connection Application</th>' +
            //     '<th>Connection #</th>' +
            //     '<th>User Name</th>' +
            //     '<th>Password</th>' +
            //     '<th>Additional Info</th>' +
            //     '<th></th>' +
            //     '<th></th>';
            // }

            var tempHeadingNum = Math.random().toFixed(3).split('.')[1];
            var accordianCustomerHTML = 
                '<div class="accordion-item" id="' + data._id + '">' +
                    '<h2 class="accordion-header" id="heading'+ tempHeadingNum +'">' +
                        '<button style="padding: 0 1.5rem 0;" class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse'+ tempHeadingNum +'" aria-expanded="false" aria-controls="collapse'+ tempHeadingNum +'">' +
                            '<span class="CustomerCode" >CODE: ' + data.code + '</span>' +
                            '<span class="CustomerTitle">'+ data.name +'</span>' +
                        '</button>'+
                    '</h2>'+
                    '<div id="collapse'+ tempHeadingNum +'" class="accordion-collapse collapse" aria-labelledby="heading'+ tempHeadingNum +'" data-bs-parent="#accordionParent">' +
                        '<div class="accordion-body">' +
                            '<span class="bodyEmpty"></span>' +
                            '<div class="customer-actions-container">' +
                                '<table class="additionalCustomerInfoTable">' +
                                    '<tr>' +
                                        '<td>' + data.address + ', </td>' + 
                                        '<td>' + data.city + '</td>' + 
                                        '<td>' + data.state + '</td>' + 
                                        '<td>' + data.zip + '</td>' + 
                                    '</tr>' +
                                '</table>' +
                                '<button id="addJob-' + data._id + '" class="btn btn-success">Add a Job</button>' +
                                '<button id="editCustomer-' + data._id + '" class="btn btn-success">Edit Customer</button>' +
                                '<button id="deleteCustomer-' + data._id + '" class="btn btn-danger">Delete Customer</button>' +
                            '</div>' +
                            
                            '<table class="mainTableForCustomer table table-dark table-striped table-hover" id="jobTable' + data._id + '">' +
                                // jobSection TODO build this logic.
                                '<th>Job #</th>'+
                                '<th>Connection Application</th>' +
                                '<th>Connection #</th>' +
                                '<th>User Name</th>' +
                                '<th>Password</th>' +
                                '<th>Additional Info</th>' +
                                '<th></th>' +
                                '<th></th>' +
                            '</table>'+
                        '</div>' +
                    '</div>' +
                '</div>';
            
            $('#accordionParent').prepend(accordianCustomerHTML);
            $('#creatCustomerModal').modal("hide");

            $('#createCustomerName').val('');
            $('#createCustomerCode').val('');
            $('#createCustomerCity').val('');
            $('#createCustomerAddress').val('');
            $('#CreateCustomerZIP').val('');
            
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
            console.log('error')
        }
    });
}

function deleteCustomer(id){
    $.ajax({
        method: 'DELETE',
        dateType: 'json',
        url: 'http://localhost:3000/deleteCustomer',
        data: {"id": id},
        success: function (res){
            $.removeCookie('customer' + id + '');
            var toastLiveExample = document.getElementById('liveToast');
            if(res !== 'ERROR!'){
                var toast = new bootstrap.Toast(toastLiveExample);
                toast.show();
                $("#accordionParent > #" + id).remove(); //remove the customer from the accordion DOM.
            }else{
                var toastLiveExampleERROR = document.getElementById('liveToastERROR');
                var toasterror = new bootstrap.Toast(toastLiveExampleERROR)
                toasterror.show();
            };
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
            var toastLiveExampleERROR = document.getElementById('liveToastERROR');
            var toasterror = new bootstrap.Toast(toastLiveExampleERROR)
            toasterror.show();
        }
    });
}
