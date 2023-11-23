

    
    var YOUR_REDIRECT_URI = 'https://graph-tree.w3spaces.com';
    var fragmentString = location.hash.substring(1);

    // Parse query string to see if page request is coming from OAuth 2.0 server.
    var params = {};
    var regex = /([^&=]+)=([^&]*)/g, m;
    while (m = regex.exec(fragmentString)) {
      params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }
    if (Object.keys(params).length > 0) {
      localStorage.setItem('oauth2-test-params', JSON.stringify(params));
      if (params['state'] && params['state'] == 'try_sample_request') {
        trySampleRequest();
      }
    }


function trySampleRequest(folderId, parentElement, level) {
  
  var params = JSON.parse(localStorage.getItem('oauth2-test-params'));
  if (params && params['access_token']) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET',
      'https://www.googleapis.com/drive/v3/files' +
      '?access_token=' + params['access_token'] +
      '&q=' + encodeURIComponent("mimeType='application/vnd.google-apps.folder' and '" + folderId + "' in parents") +
      '&fields=*');
    xhr.onreadystatechange = function (e) {
      if (xhr.readyState === 4 && xhr.status === 200) {
        let folderData = JSON.parse(xhr.response);
        console.log(folderData);

        // Process each subfolder
        if (folderData.files) {
          // Create a new list for subfolders with a class
          var subfolderList = document.createElement('ul');
          subfolderList.className = 'subfolder-list'; // Add your class name here
          parentElement.appendChild(subfolderList);

          folderData.files.forEach(function (subfolder, index) {
            // Create a new list item for the subfolder with a class
            var subfolderItem = document.createElement('li');
            subfolderItem.className = 'subfolder-item'; // Add your class name here

            // Create an icon element for the folder
            var folderIcon = document.createElement('i');
            folderIcon.className = 'far fa-folder-open'; // Add your Font Awesome class here

            // Create an empty span element with the "line" class
            var emptySpan = document.createElement('span');
            emptySpan.className = 'line'; // Add your class name here

            // Create a span for the folder name
            var folderName = document.createElement('span');
            folderName.textContent = subfolder.name;

            // Append the empty span, icon, and folder name to the list item
            subfolderItem.appendChild(emptySpan);
            subfolderItem.appendChild(folderIcon);
            subfolderItem.appendChild(folderName);

            // Recursively get subfolders
            trySampleRequest(subfolder.id, subfolderItem, level + 1);

            // Add the subfolder item to the subfolder list
            subfolderList.appendChild(subfolderItem);
          });
        }
      } else if (xhr.readyState === 4 && xhr.status === 401) {
        // Token invalid, so prompt for user permission.
        oauth2SignIn();
      }
    };
    xhr.send(null);
  } else {
    oauth2SignIn();
  }
}






    function oauth2SignIn() {
      var YOUR_CLIENT_ID = document.querySelector('#client-id').value
    //   var YOUR_CLIENT_ID = '827991249178-7266v9638qfmdms8hea327dnemnv19eq.apps.googleusercontent.com'
      // Google's OAuth 2.0 endpoint for requesting an access token
      var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

      // Create element to open OAuth 2.0 endpoint in a new window.
      var form = document.createElement('form');
      form.setAttribute('method', 'GET'); // Send as a GET request.
      form.setAttribute('action', oauth2Endpoint);

      // Parameters to pass to the OAuth 2.0 endpoint.
      var params = {
        'client_id': YOUR_CLIENT_ID,
        'redirect_uri': YOUR_REDIRECT_URI,
        'scope': 'https://www.googleapis.com/auth/drive.metadata.readonly',
        'state': 'try_sample_request',
        'include_granted_scopes': 'true',
        'response_type': 'token'
      };          

      // Add form parameters as hidden input values.
      for (var p in params) {
        var input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name', p);
        input.setAttribute('value', params[p]);
        form.appendChild(input);
      }

      // Add form to the page and submit it to open the OAuth 2.0 endpoint.
      document.body.appendChild(form);
      form.submit();
    }

    // Start with the root folder (My Drive)
    
    const btn = document.querySelector('#btn');
    btn.addEventListener('click', () => {
      trySampleRequest('root', document.getElementById('tree-container'), 0);
    });
