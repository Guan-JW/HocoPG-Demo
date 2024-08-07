// sql input
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const runButton = document.getElementById('run-button');
    const recommendationsContainer = document.getElementById('recommendations');
    const messageContainer = document.getElementById('message-container');
  
    const loadingSpinner = document.createElement('div');
    loadingSpinner.classList.add('loading-spinner');
    document.body.appendChild(loadingSpinner);
    const overlay = document.getElementById('overlay');
  
    const headerSearchInput = document.getElementById('header-search-input');

    //   hide and show corresponding pages
    //   page-origin
    const sidebar = document.querySelector('.sidebar');
    const resizeHandle = document.querySelector('.resize-handle');
    const displayContainer = document.getElementById('page-org');
    const dataContainer = document.querySelector('.data-table-container');
        
    //   page-graph
    const graphContainer = document.querySelector('.graph-container');
    //   tabs
    const dataTab = document.getElementById('data-tab');
    const chartTab = document.getElementById('chart-tab');
    const sumTab = document.getElementById('sum-tab');

    // table in page-org

    const tooltip = document.getElementById('db-tooltip');
    const dbName = document.getElementById('db-name');
    const dbList = tooltip.querySelector('.db-list');
    
    // change name according to our selection
    const dbNameElement = document.getElementById('db-name');
    const tableNameElement = document.querySelector('.table-name');

    // table in page-org
    const tableHead = document.getElementById('table-head');
    const tableBody = document.getElementById('table-body');
    const rowsPerPageSelect = document.getElementById('rows-per-page');
    const prevPageButton = document.getElementById('prev-page');
    const nextPageButton = document.getElementById('next-page');
    const pageNumberDisplay = document.getElementById('page-number');
    const totalPageNumberDisplay = document.getElementById('total-page-number');
    const gotoPageInput = document.getElementById('goto-page');
    const gotoButton = document.getElementById('goto-button');
    
    let currentPage = 1;
    let rowsPerPage = parseInt(rowsPerPageSelect.value);
    let totalRows = 389;    // TODO: load rows from table
    let totalPage = parseInt((totalRows + rowsPerPage - 1) / rowsPerPage);
    totalPageNumberDisplay.textContent = totalPage;
    const rowLimit = 400;

    let sampleData = generateSampleData(totalRows);
    let sampleHead = generateSampleTableHeader();

    // initialize table
    function generateSampleTableHeader() {
        return [
          // "#", // 注意，可能要特殊处理一下 id
          "time", "__source__", "__tag__:__receive_time__", "__tag__:__receive_time__0", "__topic__", "body_bytes_sent", "host", "http_referer", "http_user_agent", "http_x_forwarded_for", "remote_addr", "request_length", "request_method"];
    }
    // TODO: get table tuples
    function generateSampleData(count) {
        return [
            {
                "time": "07-11 20:54:30",
                "__source__": "127.0.0.1",
                "__tag__:__receive_time__": "1720702480",
                "__tag__:__receive_time__0": "1720702480",
                "__topic__": "nginx_access_log",
                "body_bytes_sent": 4017,
                "host": "www.wa.mock.com",
                "http_referer": "www.tpz.mock.com",
                "http_user_agent": `Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/535.1 (KHTML, li
ke Gecko) Chrome/14.0.814.0 Safari/535.1`,
            },
            {
                "time": "07-11 20:54:30",
                "__source__": "127.0.0.1",
                "__tag__:__receive_time__": "1720702480",
                "__tag__:__receive_time__0": "1720702480",
                "__topic__": "nginx_access_log",
                "body_bytes_sent": 2119,
                "host": "www.pd.mock.com"
            },
            {
                "time": "07-11 20:54:30",
                "__source__": "127.0.0.1",
                "__tag__:__receive_time__": "1720702480",
                "__tag__:__receive_time__0": "1720702480",
                "__topic__": "nginx_access_log",
                "body_bytes_sent": 1076,
                "host": "www.uf.mock.com"
            },
            {
                "time": "07-11 20:54:30",
                "__source__": "127.0.0.1",
                "__tag__:__receive_time__": "1720702480",
                "__tag__:__receive_time__0": "1720702480",
                "__topic__": "nginx_access_log",
                "body_bytes_sent": 3763,
                "host": "www.ke.mock.com"
            },
            {
                "time": "07-11 20:54:30",
                "__source__": "127.0.0.1",
                "__tag__:__receive_time__": "1720702480",
                "__tag__:__receive_time__0": "1720702480",
                "__topic__": "nginx_access_log",
                "body_bytes_sent": 2388,
                "host": "www.dyy.mock.com"
            },
            {
                "time": "07-11 20:54:30",
                "__source__": "127.0.0.1",
                "__tag__:__receive_time__": "1720702480",
                "__tag__:__receive_time__0": "1720702480",
                "__topic__": "nginx_access_log",
                "body_bytes_sent": 14892,
                "host": "www.dz.mock.com"
            },
            {
                "time": "07-11 20:54:30",
                "__source__": "127.0.0.1",
                "__tag__:__receive_time__": "1720702480",
                "__tag__:__receive_time__0": "1720702480",
                "__topic__": "nginx_access_log",
                "body_bytes_sent": 1069,
                "host": "www.rt.mock.com"
            }
        ];
    }

    const allRecommendations = [
        "SELECT * FROM dna_seq;",
        "SELECT * FROM persons;",
        "SELECT * FROM compress_scheme_comparison('dna_seq', 'exp_log', 10);",
        "SELECT * FROM create_compression_table('dna_seq', 'exp_log', 10);",
        "SELECT * FROM comp_dna_seq_exp_log;",
        // Add more recommendations here
    ];

    let historyBuffer = [
        "SELECT * FROM compress_scheme_comparison('dna_seq', 'exp_log', 5);",
        "SELECT * FROM create_compression_table('dna_seq', 'exp_log', 5);",
        "SELECT * FROM comp_dna_seq_seq_data;"
    ];

    searchInput.addEventListener('focus', () => {
        recommendationsContainer.classList.remove('hidden');
    });

    searchInput.addEventListener('blur', () => {
        setTimeout(() => {
            recommendationsContainer.classList.add('hidden');
        }, 200);
    });

    // Filter recommendations with input
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        const filteredRecommendations = allRecommendations.filter(rec => rec.toLowerCase().includes(query));
        const filteredHistories = historyBuffer.filter(rec => rec.toLowerCase().includes(query));
        renderRecommendations(filteredRecommendations, filteredHistories);
    });

    // Show recommendations on clicking chatbox
    recommendationsContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('recommendation')) {
            searchInput.value = event.target.textContent;
            // updateHighlighting();
            recommendationsContainer.classList.add('hidden');
        }
    });

    // Filter recommendations or histories based on input
    function renderRecommendations(recommendations, histories) {
        const sections = recommendationsContainer.querySelectorAll('.section');
        sections.forEach(section => section.remove());

        const intelligentSection = createSection('Recommendation', recommendations.filter(rec => rec.toLowerCase()));
        const historySection = createSection('History', histories.filter(rec => rec));

        recommendationsContainer.appendChild(intelligentSection);
        recommendationsContainer.appendChild(historySection);
    }
  
    // create recommendation and history sections
    function createSection(title, recommendations) {
        const section = document.createElement('div');
        section.classList.add('section');

        const sectionTitle = document.createElement('div');
        sectionTitle.classList.add('section-title');
        sectionTitle.textContent = title;

        section.appendChild(sectionTitle);

        recommendations.forEach(rec => {
            const recommendation = document.createElement('div');
            recommendation.classList.add('recommendation');
            recommendation.textContent = rec;
            section.appendChild(recommendation);
        });

        return section;
    }

    // Handle button click and "Enter" key press
    runButton.addEventListener('click', runQuery);
    searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault(); // Prevents default action of creating a new line
            runQuery();
        }
    });

    function runQuery() {
        const query = searchInput.value.trim();
        if (query) {
            console.log('Running query:', query);
            recommendationsContainer.classList.add('hidden'); // Hide recommendations container
            overlay.classList.add('show'); // Show overlay with blur effect
            loadingSpinner.style.display = 'block'; // Show loading spinner
            // Simulate a delay for showing results
            // setTimeout(() => {
            //     overlay.classList.remove('show'); // Hide overlay with blur effect
            //     loadingSpinner.style.display = 'none'; // Hide loading spinner
            //     // showMessage(`Showing results for query: ${query}`);
            // }, 2000); // 2 seconds delay

            $.ajax({
                url: '/execute-query/',  // URL to the Django view
                type: 'POST', // Typically POST for sending data
                headers: {'X-CSRFToken': getCookie('csrftoken')},  // Include CSRF token
                data: { 'query': query }, // Data you're sending to the server
                success: function(response) {
                    // console.log('Query results:', response.data); // Log or process your response data here
                    showMessage(`Showing results for query: ${query}`);
                    updateHistoryBuffer(query); // Update history buffer on success

                    // update main table
                    console.log("type = " + response.type);
                    if (response.table) { 
                        // if we can identify the table the sql is running on
                        const preTableName = tableNameElement.textContent;
                        let cntTableName = response.table;
                        if (response.type == 1) {
                            // Query type: select
                            // dataContainer.classList.remove('hidden');
                            sampleHead = response.column;
                            // console.log("sample Head = " + sampleHead);
                            sampleData = response.data;
                            totalRows = sampleData.length;
                            if (cntTableName.length == 1) {
                                if (cntTableName != preTableName) {
                                    tableNameElement.textContent = cntTableName[0];
                                }
                            }
                            // cntTableName =  extract_compress_table_name
                            updatePageOrgTable(cntTableName[0]);

                            if (check_compress_scheme_comparison(cntTableName[0])) {
                                // if the query is to compare different compression schemes
                                console.log("scheme comparison start!");
                                const tabButtons = document.querySelectorAll('.tab-button');
                                tabButtons.forEach(btn => btn.classList.remove('active'));
                                const chartTab = document.getElementById("chart-tab");
                                chartTab.classList.add('active');

                                const names = extractTableAndColumnName(cntTableName[0]);
                                if (names != null) {
                                    console.log('showing data!');
                                    showGraphContainer(names.tableName, names.columnName);
                                }
                            }
                        }
                        else if (response.type == 2) {
                            // Query type: create, alter, insert into, update, delete
                            // dataContainer.classList.remove('hidden');
                            if (cntTableName.length == 1) {
                                if (cntTableName != preTableName) {
                                    tableNameElement.textContent = cntTableName;
                                }
                            }
                            updatePageOrgTable(cntTableName, true);
                        }
                        else if (response.type == 3) {
                            // drop table
                            console.log("cntTableName = " + cntTableName);
                            console.log("preTableName = " + preTableName);
                            // if (cntTableName == preTableName) {
                            //     console.log("same");
                            //     dataContainer.classList.add('hidden');
                            // }
                            showMessage(`Successfully deleted Table ${cntTableName}.`);
                        }
                                
                        overlay.classList.remove('show'); // Hide overlay with blur effect
                        loadingSpinner.style.display = 'none'; // Hide loading spinner
                    }
                },
                error: function(xhr, status, error) {
                    console.error("AJAX Error:", error);
                    var errorMessage = xhr.responseJSON && xhr.responseJSON.error ? xhr.responseJSON.error : "Unknown error occurred";
                    showMessage(`Error executing query: ${errorMessage}`);
                },
            });

        }
       else { // deal with error or null
          showMessage(`No query provided (or wrong sql given).`);
       }
    }

    function showGraphContainer(tableName, colName) {
        // set table name and column name

        sidebar.classList.add('hidden');
        displayContainer.classList.add('hidden');
        graphContainer.classList.remove('hidden');

        showGraphTable(tableName, colName); // default for the page-graph
        const toolbarTableTitle = document.getElementById("preview-table");
        const toolbarColTitle = document.getElementById("preview-col");
        toolbarTableTitle.textContent = tableName;
        toolbarColTitle.textContent = colName;

        showSizeSummaryTable(tableName, colName);
        const summaryTableTitle = document.getElementById("summary-table");
        const summaryColTitle = document.getElementById("summary-col");
        summaryTableTitle.textContent = tableName;
        summaryColTitle.textContent = colName;

        showTimeSummaryTable(tableName, colName);
        const timeTableTitle = document.getElementById("summary-time-table");
        const timeColTitle = document.getElementById("summary-time-col");
        timeTableTitle.textContent = tableName;
        timeColTitle.textContent = colName;
    }
    
    // default for the page-graph
    function showGraphTable(tableName, colName) {
        const tableHead = document.getElementById('preview-table-head');
        const tableBody = document.getElementById('preview-table-body');
        const rowsPerPageSelect = document.getElementById('preview-rows-per-page');
        const prevPageButton = document.getElementById('flip-prev-page');
        const nextPageButton = document.getElementById('flip-next-page');
        const pageNumberDisplay = document.getElementById('flip-page-number');
        const totalPageNumberDisplay = document.getElementById('flip-total-page-number');
        const preiviewTotalTuple = document.getElementById('preview-total');

    //     TODO: get result tuple number
        let currentPage = 1;
        let rowsPerPage = parseInt(rowsPerPageSelect.value);
        let totalRows = 389;    // TODO: load rows from table
        let totalPage = parseInt((totalRows + rowsPerPage - 1 ) / rowsPerPage); 

        let sampleData = generateSampleData(totalRows);
        let sampleHead = generateSampleTableHeader();

        const query = `select * from get_compression_sizes('${tableName}', '${colName}');`;
        // const query = `select * from comp_sizes`;
        console.log('Running query:', query);
        $.ajax({
            url: '/execute-query/',  // URL to the Django view
            type: 'POST', // Typically POST for sending data
            headers: {'X-CSRFToken': getCookie('csrftoken')},  // Include CSRF token
            data: { 'query': query }, // Data you're sending to the server
            success: function(response) {
                // console.log('Query results:', response.data); // Log or process your response data here
                showMessage(`Showing results for query: ${query}`);
                updateHistoryBuffer(query); // Update history buffer on success

                // update main table
                currentPage = 1;
                sampleHead = response.column;
                sampleData = response.data;
                totalRows = sampleData.length;
                totalPage = parseInt((totalRows + rowsPerPage - 1 ) / rowsPerPage); 
                totalPageNumberDisplay.textContent = totalPage;
                preiviewTotalTuple.textContent = `Total: ${totalRows}`;
                renderTable(currentPage);

                // Save the data to cache
                updateDataCache('table-icon', tableName, colName);
                setTableColDataCache(tableName, colName);
            },
            error: function(xhr, status, error) {
                console.error("AJAX Error:", error);
                var errorMessage = xhr.responseJSON && xhr.responseJSON.error ? xhr.responseJSON.error : "Unknown error occurred";
                showMessage(`Error executing query: ${errorMessage}`);
            },
        });


        // TODO: get table header
        function generateSampleTableHeader() {
            return [
              // "#", // 注意，可能要特殊处理一下 id
              "scheme", "space", "compress_time"
              // , "__tag__:__receive_time__", "__tag__:__receive_time__0", "__topic__", "body_bytes_sent", "host", "http_referer", "http_user_agent", "http_x_forwarded_for", "remote_addr", "request_length", "request_method"
            ];
        }

        // TODO: get table tuples
        function generateSampleData(count) {
            return [
                {
                    "scheme": "PGLZ",
                    "space": 0,
                    "compress_time": 0,
                },
                {
                    "scheme": "LZ4",
                    "space": 0,
                    "compress_time": 0,
                },
                {
                    "scheme": "ZSTD",
                    "space": 0,
                    "compress_time": 0,
                },
                {
                    "scheme": "RLE",
                    "space": 0,
                    "compress_time": 0,
                },
                {
                    "scheme": "TADOC",
                    "space": 0,
                    "compress_time": 0,
                },
                {
                    "scheme": "LZW",
                    "space": 0,
                    "compress_time": 0,
                }
            ];
        }

        function renderTable(page) {
            tableHead.innerHTML = '';
            let tr = document.createElement('tr');
            tr.innerHTML = '<th>#</th>';  // id, 注意，可能要特殊处理一下 id
            sampleHead.forEach((head, index) => {
                    // console.log(head);
                tr.innerHTML += `<th>${head}</th>`;
            });
            tableHead.appendChild(tr);
            
            tableBody.innerHTML = '';
            let start = (page - 1) * rowsPerPage;
            let end = start + rowsPerPage;
            let rows = sampleData.slice(start, end);
            rows.forEach((row, index) => {
                let tr = document.createElement('tr');
                tr.innerHTML = `<td>${start + index + 1}</td>`;   // id, 注意，可能要特殊处理一下 id
                sampleHead.forEach((head, hid) => {
                    if ( row.hasOwnProperty(head) )
                        tr.innerHTML += `<td> ${row[head]} </td>`;
                    else {
                        tr.innerHTML += `<td> Nil </td>`; // 注意，可能要特殊处理一下空值情况（pg一般不会出现？
                    }
                });
                tableBody.appendChild(tr);
            });

            overlay.classList.remove('show'); // Hide overlay with blur effect
            loadingSpinner.style.display = 'none'; // Hide loading spinner
        }

        function updatePagination() {
            pageNumberDisplay.textContent = currentPage;
        }

        // change the rows to present in current page. load the corresponding slice from the data -- TODO: check when adding more data
        rowsPerPageSelect.addEventListener('change', () => {
            rowsPerPage = parseInt(rowsPerPageSelect.value);
            currentPage = 1;
            renderTable(currentPage);
            updatePagination();
        });

        // turn to the previous page
        prevPageButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderTable(currentPage);
                updatePagination();
            }
        });

        // turn to the next page
        nextPageButton.addEventListener('click', () => {
            if (currentPage < Math.ceil(totalRows / rowsPerPage)) {
                currentPage++;
                renderTable(currentPage);
                updatePagination();
            }
        });

        renderTable(currentPage);
        updatePagination();

    }

    function showSizeSummaryTable(tableName, colName) {
        const tableHead = document.getElementById('summary-table-head');
        const tableBody = document.getElementById('summary-table-body');
        const query = `select * from comp_size_info_${tableName}_${colName};`;
        // const query = `select * from comp_size_total`;
        console.log('Running query:', query);

        let sampleHead = null;
        let sampleData = null;

        $.ajax({
            url: '/execute-query/',  // URL to the Django view
            type: 'POST', // Typically POST for sending data
            headers: {'X-CSRFToken': getCookie('csrftoken')},  // Include CSRF token
            data: { 'query': query }, // Data you're sending to the server
            success: function(response) {
                // console.log('Query results:', response.data); // Log or process your response data here
                showMessage(`Showing results for query: ${query}`);
                updateHistoryBuffer(query); // Update history buffer on success

                // update main table
                currentPage = 1;
                sampleHead = response.column;
                sampleData = response.data;
                renderTable();
                
                sampleData.forEach(data => {
                    console.log(data);
                })
                console.log(Object.keys(sampleData));
                console.log(Object.keys(sampleData).length);
                setDataCache(tableName, colName, {"Compressed Size (byte)": sampleData["0"]});
            },
            error: function(xhr, status, error) {
                console.error("AJAX Error:", error);
                var errorMessage = xhr.responseJSON && xhr.responseJSON.error ? xhr.responseJSON.error : "Unknown error occurred";
                showMessage(`Error executing query: ${errorMessage}`);
            },
        });


        function renderTable() {
            tableHead.innerHTML = '';
            let tr = document.createElement('tr');
            tr.innerHTML = '';  
            sampleHead.forEach((head, index) => {
                tr.innerHTML += `<th>${head}</th>`;
            });
            tableHead.appendChild(tr);
            
            tableBody.innerHTML = '';
            sampleData.forEach((row, index) => {
                let tr = document.createElement('tr');
                tr.innerHTML = ``;
                sampleHead.forEach((head, hid) => {
                    if ( row.hasOwnProperty(head) )
                        tr.innerHTML += `<td> ${row[head]} </td>`;
                    else {
                        tr.innerHTML += `<td> Nil </td>`; // 注意，可能要特殊处理一下空值情况（pg一般不会出现？
                    }
                });
                tableBody.appendChild(tr);
            });
        }
    }

    function showTimeSummaryTable(tableName, colName) {
        const tableHead = document.getElementById('summary-time-table-head');
        const tableBody = document.getElementById('summary-time-table-body');
        const query = `select * from comp_time_info_${tableName}_${colName};`;
        // const query = `select * from comp_time_total`;
        console.log('Running query:', query);

        let sampleHead = null;
        let sampleData = null;

        $.ajax({
            url: '/execute-query/',  // URL to the Django view
            type: 'POST', // Typically POST for sending data
            headers: {'X-CSRFToken': getCookie('csrftoken')},  // Include CSRF token
            data: { 'query': query }, // Data you're sending to the server
            success: function(response) {
                // console.log('Query results:', response.data); // Log or process your response data here
                showMessage(`Showing results for query: ${query}`);
                updateHistoryBuffer(query); // Update history buffer on success

                // update main table
                currentPage = 1;
                sampleHead = response.column;
                sampleData = response.data;
                renderTable();

                setDataCache(tableName, colName, {"Compression Time (ms)": sampleData["0"]});
            },
            error: function(xhr, status, error) {
                console.error("AJAX Error:", error);
                var errorMessage = xhr.responseJSON && xhr.responseJSON.error ? xhr.responseJSON.error : "Unknown error occurred";
                showMessage(`Error executing query: ${errorMessage}`);
            },
        });


        function renderTable() {
            tableHead.innerHTML = '';
            let tr = document.createElement('tr');
            tr.innerHTML = '';  
            sampleHead.forEach((head, index) => {
                tr.innerHTML += `<th>${head}</th>`;
            });
            tableHead.appendChild(tr);
            
            tableBody.innerHTML = '';
            sampleData.forEach((row, index) => {
                let tr = document.createElement('tr');
                tr.innerHTML = ``;
                sampleHead.forEach((head, hid) => {
                    if ( row.hasOwnProperty(head) )
                        tr.innerHTML += `<td> ${row[head]} </td>`;
                    else {
                        tr.innerHTML += `<td> Nil </td>`; // 注意，可能要特殊处理一下空值情况（pg一般不会出现？
                    }
                });
                tableBody.appendChild(tr);
            });
        }
    }

    // Update history buffer with the new query
    function updateHistoryBuffer(query) {
        // Check if the query already exists in the buffer
        const index = historyBuffer.indexOf(query);
        if (index !== -1) {
            // Remove the existing query
            historyBuffer.splice(index, 1);
        } else if (historyBuffer.length >= 3) {
            // Remove the oldest query if the buffer is full and the query is new
            historyBuffer.pop();
        }
        historyBuffer.unshift(query); // Add the new query to the beginning of the buffer
        console.log(historyBuffer);
        renderRecommendations(allRecommendations, historyBuffer); // Re-render recommendations to include the updated history
    }

    // render table for page-org

    function renderTable(page) {
        tableHead.innerHTML = '';
        let tr = document.createElement('tr');
        tr.innerHTML = '<th>#</th>';  // id, 注意，可能要特殊处理一下 id
        sampleHead.forEach((head, index) => {
            tr.innerHTML += `<th class="${head}">${head}</th>`;
        });
        tableHead.appendChild(tr);
        
        tableBody.innerHTML = '';
        let start = (page - 1) * rowsPerPage;
        let end = start + rowsPerPage;
        let rows = sampleData.slice(start, end);
        rows.forEach((row, index) => {
            let tr = document.createElement('tr');
            tr.innerHTML = `<td class="collapsible">${start + index + 1}</td>`;   // id, 注意，可能要特殊处理一下 id
            sampleHead.forEach((head, hid) => {
                if (row[head])
                    tr.innerHTML += `<td class="${sampleHead[hid]} collapsible"> ${row[head]} </td>`;
                else {
                    tr.innerHTML += `<td class="${sampleHead[hid]} collapsible"> Nil </td>`; // 注意，可能要特殊处理一下空值情况（pg一般不会出现？
                }
            });
            tableBody.appendChild(tr);
        });
    }

    function updatePagination() {
        pageNumberDisplay.textContent = currentPage;
    }

    // change the rows to present in current page. load the corresponding slice from the data -- TODO: check when adding more data
    rowsPerPageSelect.addEventListener('change', () => {
        rowsPerPage = parseInt(rowsPerPageSelect.value);
        currentPage = 1;
        renderTable(currentPage);
        updatePagination();
    });
    
    // turn to the previous page
    prevPageButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable(currentPage);
            updatePagination();
        }
    });
    
    // turn to the next page
    nextPageButton.addEventListener('click', () => {
        if (currentPage < Math.ceil(totalRows / rowsPerPage)) {
            currentPage++;
            renderTable(currentPage);
            updatePagination();
        }
    });

    // go to the input page
    gotoButton.addEventListener('click', () => {
        let gotoPage = parseInt(gotoPageInput.value);
        if (gotoPage >= 1 && gotoPage <= Math.ceil(totalRows / rowsPerPage)) {
            currentPage = gotoPage;
            renderTable(currentPage);
            updatePagination();
        }
    });
    renderTable(currentPage);
    updatePagination();

    // choose database and change fields in sidebar as well as table
    // choose database
    dbName.addEventListener('click', (event) => {
        event.stopPropagation();
        fetchDatabases();
        tooltip.classList.add('show');
    });

    function fetchDatabases() {
        dbList.innerHTML = ''; // Clear existing content

        $.ajax({
            url: '/list-databases/',  // URL to the Django view
            type: 'GET',
            success: function(response) {
                if (response.success) {
                    const databases = response.databases;
                    // TODO: check if is empty pg
                    databases.forEach(db => {
                        const dbItemWrapper = document.createElement('div');
                        dbItemWrapper.className = 'db-item-wrapper';
                        
                        const dbItem = document.createElement('div');
                        dbItem.className = 'db-item';
                        dbItem.innerHTML = `<i class="fas fa-database db-icon"></i>${db} <i class="fas fa-chevron-right toggle-icon"></i>`;
                        var clicktime = 0;
                        dbItem.addEventListener('click', (event) => {
                            event.stopPropagation();
                            dbItem.classList.toggle('expanded');
                            const tableList = dbItem.nextElementSibling;
                            const viewList = dbItem.nextElementSibling.nextElementSibling;
                            if (clicktime == 0) {
                                tableList.style.display = 'block';
                                clicktime = 1;
                                fetchTables(db, tableList);
                                fetchViews(db, viewList);
                            }
                            else {
                                tableList.style.display = tableList.style.display === 'none' ? 'block' : 'none';
                                viewList.style.display = viewList.style.display === 'none' ? 'block' : 'none';
                            }
                        });

                        const tableList = document.createElement('ul');
                        tableList.className = 'table-list';
                        const viewList = document.createElement('ul');
                        viewList.className = 'table-list';
                        
                        dbItemWrapper.appendChild(dbItem);
                        dbItemWrapper.appendChild(tableList);
                        dbItemWrapper.appendChild(viewList);
                        dbList.appendChild(dbItemWrapper);
                    });
                    tooltip.classList.add('show');
                } else {
                    showMessage(response.error || 'Failed to fetch databases.');
                }
            },
            error: function(xhr, status, error) {
                console.error("AJAX Error:", error);
                showMessage("Failed to fetch databases.");
            }
        });
    }

    function fetchTables(db, tableList) {

        $.ajax({
            url: '/execute-query/',  // URL to the Django view
            type: 'POST',
            headers: {'X-CSRFToken': getCookie('csrftoken')},
            data: { 'query': `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_catalog = '${db}' AND table_name NOT LIKE 'auth_%' AND table_name NOT LIKE 'django_%' AND table_name NOT LIKE 'admin_%' AND table_type='BASE TABLE' AND table_schema NOT IN ('pg_catalog', 'information_schema');` },
            success: function(response) {
                if (response.success) {
                    const tables = response.data;
                    tableList.innerHTML = ''; // Clear existing content
                    tables.forEach(table => {
                        const tableItem = document.createElement('li');
                        tableItem.className = 'table-item';
                        tableItem.innerHTML = `<i class="fas fa-table table-icon"></i>${table.table_name}`;
                        tableItem.addEventListener('click', () => updateNames(db, table.table_name)); // Add event listener to update names on click
                        tableList.appendChild(tableItem);
                    });
                    tableList.style.display = 'block'; // Show the table list
                } else {
                    showMessage(response.error || 'Failed to fetch tables.');
                }
            },
            error: function(xhr, status, error) {
                console.error("AJAX Error:", error);
                showMessage("Failed to fetch tables.");
            }
        });
    }

    function fetchViews(db, tableList) {
        $.ajax({
            url: '/execute-query/',  // URL to the Django view
            type: 'POST',
            headers: {'X-CSRFToken': getCookie('csrftoken')},
            data: { 'query': `SELECT table_schema, table_name FROM information_schema.views WHERE table_schema NOT IN ('information_schema', 'pg_catalog');` },
            success: function(response) {
                if (response.success) {
                    const tables = response.data;
                    console.log(tables);
                    tableList.innerHTML = ''; // Clear existing content
                    tables.forEach(table => {
                        console.log(table);
                        const tableItem = document.createElement('li');
                        tableItem.className = 'table-item';
                        tableItem.innerHTML = `<i class="fas fa-eye view-icon"></i>${table.table_name}`;
                        tableItem.addEventListener('click', () => updateNames(db, table.table_name)); // Add event listener to update names on click
                        console.log(tableList);
                        tableList.appendChild(tableItem);
                    });
                    tableList.style.display = 'block'; // Show the table list
                } else {
                    showMessage(response.error || 'Failed to fetch views.');
                }
            },
            error: function(xhr, status, error) {
                console.error("AJAX Error:", error);
                showMessage("Failed to fetch views.");
            }
        });
    }
    
    // update database and table names
    function updateNames(databaseName, tableName) {
        dbNameElement.textContent = databaseName; // Update the database name
        tableNameElement.innerHTML = `<i class="fas fa-table table-icon"></i> ${tableName}`;
        // TODO: update table
        updatePageOrgTable(tableName, true);
    }

    // detect if table name begins and ends with single-quote
    function deleteQuote(tables) {
        let table = tables;
        console.log("deleteQuote: table = " + table);
        console.log("Type of table: ", typeof table); // Log the type of the 'table' variable
        console.log("table.isarray? " + Array.isArray(table));
        if (Array.isArray(tables)) {
            table = tables[0];
        }
        if (typeof table === 'string' && (table.startsWith("'") && table.endsWith("'")) || 
            (table.startsWith('"') && table.endsWith('"'))) {
            tableName = table.substring(1, table.length - 1);
            console.log("tableName = " + tableName);
            return tableName;
        }
        else {
            return table;
        }
    }

    function check_compress_scheme_comparison(table) {
        let tableName = table;
        if (typeof table === "string" && table.startsWith("'") && table.endsWith("'")) {
            tableName = table.substring(1, table.length - 1);
        }
        if (tableName.startsWith('compress_scheme_comparison')) {
            return true;
        }
        return false;
    }

    function extractTableAndColumnName(queryString) {
        // Regular expression to match the function call and capture the table name and column name
        const regex = /compress_scheme_comparison\('(\w+)', '(\w+)', \d+\)/;
    
        // Apply the regex to the query string
        const match = queryString.match(regex);
    
        // Check if there's a match and return the captured groups
        if (match && match[1] && match[2]) {
            return {
                tableName: match[1],  // This will capture the table name 'dna_seq'
                columnName: match[2]  // This will capture the column name 'exp_log'
            };
        } else {
            return null; // Return null if no match is found
        }
    }

    function extract_compress_column_name(queryString) {
        // Regular expression to match the function call and capture the column name
        const regex = /compress_scheme_comparison\('\w+', '(\w+)', \d+\)/;
    
        // Apply the regex to the query string
        const match = queryString.match(regex);
    
        // Check if there's a match and return the captured group
        if (match && match[1]) {
            return match[1]; // This will be 'exp_log' in your example
        } else {
            return null; // Return null if no match is found
        }
    }
    
    function extract_compress_table_name(table) {
        // let tableName = deleteQuote(table);
        let tableName = table.replace(/'/g, "''");
        const regex = /compress_scheme_comparison\(\s*'([^']*)'/;
        const match = tableName.match(regex);
        if (match) {
            return match[1];
        } else {
            return null; // or handle the case where no match is found
        }
    }

    function updateFields(table) {
        // const query =  `select column_name, data_type from information_schema.columns where table_name = '${tableName}';`;  // show all fields
        // let tableName = table.trim();
        // let tableName = deleteQuote(table);
        let tableName = table;
        if (Array.isArray(table)) {
            tableName = table[0];
        }
        tableName = tableName.replace(/'/g, "''");
        console.log("tableName = " + tableName);
        const query = `
        SELECT a.attname AS field, t.typname AS type, a.attcompression as compression
        FROM pg_class c, pg_attribute a
            LEFT JOIN pg_description b
            ON a.attrelid = b.objoid
                AND a.attnum = b.objsubid, pg_type t
        WHERE c.relname = '${tableName}'
            AND a.attnum > 0
            AND a.attrelid = c.oid
            AND a.atttypid = t.oid
        ORDER BY a.attnum;
        `;
        $.ajax({
            url: '/execute-query/',  // URL to the Django view
            type: 'POST',
            headers: {'X-CSRFToken': getCookie('csrftoken')},
            data: { 'query': query },
            success: function(response) {
                if (response.success) {
                    const fields = response.data;
                    sampleHead = fields;
                    updateSiderFieldList(fields);
                } else {
                    showMessage(response.error || 'Failed to fetch fields.');
                }
            },
            error: function(xhr, status, error) {
                console.error("AJAX Error:", error);
                showMessage("Failed to fetch fields.");
            }
        });
    }

    // Array of main database types
    const mainDatabaseTypes = [
            'integer', 'int', 'int4', 'int8',
            'text',
            'boolean',
            'date',
            'timestamp',
            'char',
            'float', 'float8',
            'double',
            'json',
            'serial',
            'bigserial',
            'real',
            'numeric'
        ];

    const largeTextTypes = [
            'text', 
            'varchar',
            'character varying'
        ];
    
    const compressTypes = [
        'text',
    ];

    // Function to check if a string is a main database type
    function isMainDatabaseType(type) {
        const lowerCaseType = type.toLowerCase();
        return mainDatabaseTypes.includes(lowerCaseType);
    }

    function isTextType(type) {
        const lowerCaseType = type.toLowerCase();
        return largeTextTypes.includes(lowerCaseType);
    }

    function updateSiderFieldList(fields) {
        const headers = document.querySelectorAll('.toggle-field-header');
        headers.forEach(header => {
            const fieldList = header.nextElementSibling;
            const targetId = header.getAttribute('data-target');
            fieldList.innerHTML = "";
            let count = 0;
            fields.forEach(field => {
                const fieldName = field['field'];
                const fieldType = field['type'];
                const compAlgo = field['compression'];

                if (fieldType.length > 0) {
                    let firstCap = fieldType[0].toUpperCase();
                    if (fieldType == 'character varying') {
                        firstCap = 'V';
                    }
                    
                    if (targetId == "index-field") {
                        // only show text fields
                        if (isTextType(fieldType)) {
                            const fieldItem = document.createElement('li');
                            fieldItem.className = 'field-item';
                            fieldItem.innerHTML = `<div class="icon-square blue"> <i class="fas fa-${firstCap}"></i></div>${fieldName}`;
                            fieldList.appendChild(fieldItem);
                            count ++;
                        }
                    }
                    else if (targetId == "other-field") {
                        // compression fields
                        if (compAlgo) {
                            let algo = '/';
                            if (compAlgo == 'p') algo = "PGLZ";
                            else if (compAlgo == 'r') algo = "RLE";
                            else if (compAlgo == 't') algo = "TADOC";
                            else if (compAlgo == 'w') algo = "LZW";
                            else if (compAlgo == 'l') algo = "LZ4";
                            
                            const fieldItem = document.createElement('li');
                            fieldItem.className = 'field-item';
                            fieldItem.id = 'field-item-comp';
                            fieldItem.innerHTML = `<div class="field-item-inner-wrapper"><div class="icon-square red"> <i class="fas fa-${firstCap}"></i></div> <div> ${fieldName}</div> </div> <div class="comp-algo-field">${algo}</div>`;
                            fieldList.appendChild(fieldItem);
                            count ++;
                        }
                    }
                    else {
                        const fieldItem = document.createElement('li');
                        fieldItem.className = 'field-item';
    
                        if (isTextType(fieldType) ) {
                            fieldItem.innerHTML = `<div class="icon-square blue"> <i class="fas fa-${firstCap}"></i></div>${fieldName}`;
                        }
                        else if (isMainDatabaseType(fieldType)) {
                            fieldItem.innerHTML = `<div class="icon-square green"> <i class="fas fa-${firstCap}"></i></div>${fieldName}`;
                        }
                        else {
                            fieldItem.innerHTML = `<div class="icon-square grey"> <span class="symbol">/</span></div>${fieldName}`;
                        }
                        fieldList.appendChild(fieldItem);
                        count ++;
                    }
                }
            });

            if (count == 0) {
                fieldList.innerHTML = `<p class="empty-text"> No relavent fields. </p>`;
            }
        });

        // update the clicking action of sidebar fields
        defineSiderFieldAction();
    }

    function defineSiderFieldAction() {
        // clicking actions defined for fields in sidebar and the table header
        // Assuming each sidebar field has a unique ID that corresponds to a class in the table column
        const sidebarFields = document.querySelectorAll('.field-item');
        sidebarFields.forEach(field => {
            console.log("field = " + field.textContent);
            console.log(field.textContent.length);
            field.addEventListener('click', () => {
                // Remove highlight from all columns
                const allColumns = document.querySelectorAll('.data-table th');
                allColumns.forEach(col => {
                    col.classList.remove('highlight-dark');
                });
                const allTabs = document.querySelectorAll('.data-table td');
                allTabs.forEach(tab => {
                    tab.classList.remove('highlight');
                });

                // Add highlight to the clicked column
                let columnName = field.textContent.trim();
                if (columnName[0] == "/") {
                    columnName = columnName.split('/').pop().trim();
                }
                
                let targetColumn = document.querySelector(`.data-table th.${columnName}`);
                if (!targetColumn) {
                    // try inner field
                    const innerField = field.querySelector('.field-item-inner-wrapper');
                    if (innerField) {
                        // console.log("1 field = " + innerField.textContent);
                        columnName = innerField.textContent.trim();
                        targetColumn = document.querySelector(`.data-table th.${columnName}`);
                    }
                }
                if (targetColumn) {
                    targetColumn.classList.add('highlight-dark');
                    const targetTabs = document.querySelectorAll(`.data-table td.${columnName}`);
                    if (targetTabs) {
                        targetTabs.forEach(tab => {
                            tab.classList.add('highlight');
                        });
                    }
                }
            });

            field.addEventListener('dblclick', () => {
                // Remove highlight from the double-clicked column
                const columnName = field.textContent.trim();
                const targetColumn = document.querySelector(`.data-table th.${columnName}`);
                if (targetColumn) {
                    targetColumn.style.backgroundColor = '';
                }
            });
        });
    }
    

    // update table
    function updateTableHeader(fields) {
        const tableHead = document.getElementById('table-head');
        tableHead.innerHTML = '';
        let tr = document.createElement('tr');
        tr.innerHTML = '<th>#</th>';  // id, 注意，可能要特殊处理一下 id
        fields.forEach((field, index) => {
            console.log(field);
            tr.innerHTML += `<th>${field['column_name']}</th>`;
        });
        tableHead.appendChild(tr);
    }

    // function check_compress_scheme_comparison(tableName) {
    //     if (tableName.startsWith("compress_"))
    // }

    function updatePageOrgTable(tableName, firstTime=false) {
        console.log("updatePageOrgTable " + tableName);
        console.log(firstTime);
        updateFields(tableName);

        if (firstTime) {
            const query = `SELECT * FROM ${tableName} LIMIT ${rowLimit};`;
            // get rows with upper limit
            $.ajax({
                url: '/execute-query/',  // URL to the Django view
                type: 'POST', // Typically POST for sending data
                headers: {'X-CSRFToken': getCookie('csrftoken')},  // Include CSRF token
                data: { 'query': query }, // Data you're sending to the server
                success: function(response) {
                    console.log('Query results:', response.data); // Log or process your response data here
                    sampleData = response.data;
                    sampleHead = response.column;
                    console.log(sampleHead);

                    const headers = document.querySelectorAll('.toggle-field-header');
                    
                    totalRows = response.data.length;
                    totalPage = parseInt((totalRows + rowsPerPage - 1 ) / rowsPerPage); 
                    totalPageNumberDisplay.textContent = parseInt((totalRows + rowsPerPage - 1 ) / rowsPerPage); 
                    
                    updateTotalTupleCount(tableName);

                    currentPage = 1;
                    renderTable(currentPage);
                    // renderTableRows(currentPage, rowsPerPage);
                    showMessage(`Showing results: ${response.data}`);
                },
                error: function(xhr, status, error) {
                    console.error("AJAX Error:", error);
                    var errorMessage = xhr.responseJSON && xhr.responseJSON.error ? xhr.responseJSON.error : "Unknown error occurred";
                    showMessage(`Error executing query: ${errorMessage}`);
                },
            });
        }
        else {  // show result directly
            const headers = document.querySelectorAll('.toggle-field-header');
            totalRows = sampleData.length;
            totalPage = parseInt((totalRows + rowsPerPage - 1 ) / rowsPerPage); 
            totalPageNumberDisplay.textContent = parseInt((totalRows + rowsPerPage - 1 ) / rowsPerPage); 
            updateTotalTupleCount(tableName);
            currentPage = 1;
            renderTable(currentPage);
        }
    }

    function updateTotalTupleCount(tableName) {
        const totalTupleNumber = document.getElementById('total-number');
        if (totalRows == rowLimit) {
            const query = `SELECT COUNT(*) from ${tableName};`;
            $.ajax({
                url: '/execute-query/',  // URL to the Django view
                type: 'POST', // Typically POST for sending data
                headers: {'X-CSRFToken': getCookie('csrftoken')},  // Include CSRF token
                data: { 'query': query }, // Data you're sending to the server
                success: function(response) {
                    console.log('Query results:', response.data); // Log or process your response data here
                    console.log(response.data[0]['count']);
                    totalTupleNumber.textContent = `Total: ${response.data[0]['count']} (show ${rowLimit} due to space limit)`;
                    showMessage(`Showing results for query: ${query}`);
                },
                error: function(xhr, status, error) {
                    console.error("AJAX Error:", error);
                    var errorMessage = xhr.responseJSON && xhr.responseJSON.error ? xhr.responseJSON.error : "Unknown error occurred";
                    showMessage(`Error executing query: ${errorMessage}`);
                },
            });
        }
        else {
            totalTupleNumber.textContent = `Total: ${totalRows}`;
        }
    }

    // Hide the tooltip when clicking outside
    document.addEventListener('click', (event) => {
        if (!tooltip.contains(event.target) && !dbName.contains(event.target)) {
            tooltip.classList.remove('show');
        }
    });

    // Handle copy to clipboard functionality
    document.querySelectorAll('.copy-icon').forEach(icon => {
        icon.addEventListener('click', (event) => {
            const copyText = event.target.getAttribute('data-copy');
            navigator.clipboard.writeText(copyText).then(() => {
                showMessage('Copied to clipboard: ' + copyText);
            }).catch(err => {
                showMessage('Failed to copy: ' + err);
            });
        });
    });

    function showMessage(message) {
        messageContainer.textContent = message;
        messageContainer.classList.add('show');
        setTimeout(() => {
            messageContainer.classList.remove('show');
        }, 2000); // Hide message after 2 seconds
    }

    // Function to get the CSRF token
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
  
  // Handle search in header search bar
    headerSearchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevents default action of creating a new line
            headerSearchQuery();
        }
    });
    
    function headerSearchQuery() {
        const query = headerSearchInput.value.trim();
        if (query) {
            console.log('Header search query:', query); // Print the query to the console
            showMessage(`Header search query: ${query}`); // Show message with the query
            // Implement header search logic here
        }
    }
    
    // Handle copy to clipboard functionality
    document.querySelectorAll('.copy-icon').forEach(icon => {
          icon.addEventListener('click', (event) => {
              const copyText = event.target.getAttribute('data-copy');
              navigator.clipboard.writeText(copyText).then(() => {
                  showMessage('Copied to clipboard: ' + copyText);
              }).catch(err => {
                  showMessage('Failed to copy: ' + err);
              });
          });
    });


    // initialize the charts with randomly generated data
    let dataCache = {};
    dataCache["tableName"] = null;
    dataCache["colName"] = null;

    // For icon gallery in the second tab page
    const iconsContainer = document.querySelector('.icons');
    if (!iconsContainer) {
        console.error('Icons container not found');
        return;
    }
    const iconObjects = document.querySelectorAll('.icon');

    iconObjects.forEach(icon => {
        icon.addEventListener('click', () => {
            // Highlighting effect
            iconObjects.forEach(icon => icon.classList.remove('highlighted'));
            chartObjects.forEach(chart => chart.classList.remove('highlighted'));
            icon.classList.add('highlighted');

            // Get element id, and show corresponding page
            const iconId = icon.id;
            console.log("iconId = " + iconId);
            getDataCacheHTML(iconId);
        });
    });

    function setTableColDataCache(tableName, colName) {
        dataCache["tableName"] = tableName;
        dataCache["colName"] = colName;
    }

    function setDataCache(tableName, colName, data) {
        iconObjects.forEach(icon => {
            const iconId = icon.id;
            if (iconId != "table-icon") {

                if (!dataCache[iconId]) {
                    dataCache[iconId] = {};
    
                    dataCache[iconId]['html'] = getDefaultHTML(iconId);
                    dataCache[iconId]['tableName'] = tableName;
                    dataCache[iconId]['colName'] = colName;
        
                    dataCache[iconId]['data'] = dataCache[iconId]['data'] || {};
                    dataCache[iconId]['data']['label'] = ['Uncompress', 'RLE', 'TADOC', 'LZW', 'PGLZ', 'LZ4'];
                }

                // Dynamically add data from the 'data' parameter
                Object.keys(data).forEach(key => {
                    if (Object.keys(data[key]).length != dataCache[iconId]['data']['label'].length) {
                        // console.log("data = " + data);
                        console.error("The length between data and labels are not match!");
                    }

                    dataCache[iconId]['data'][key] = data[key];

                    Object.keys(dataCache[iconId]['data'][key]).forEach(key => {
                        if (dataCache[iconId]['data'][key][key] === null) {
                            dataCache[iconId]['data'][key][key] = 0; // Replace null with 0
                        }
                    });
                });

            }
        });
        
    }

    function updateDataCache(iconName, tableName, colName) {
        const mainDisplayArea = document.getElementById("main-display-area");
        dataCache[iconName] = {};
        dataCache[iconName]['html'] = mainDisplayArea.innerHTML;
        // console.log(mainDisplayArea.innerHTML);
        dataCache[iconName]['tableName'] = tableName;
        dataCache[iconName]['colName'] = colName;
    }

    function checkDataCacheExist(iconName) {
        if (dataCache[iconName] == null) {
            return false;
        }
        // console.log("checking table name = " + dataCache["tableName"] + ", column name = " + dataCache["colName"] );
        // console.log("dataCache[iconName]['tableName'] = " + dataCache[iconName]["tableName"]);
        // console.log("dataCache[iconName]['colName'] = " + dataCache[iconName]["colName"]);
        if (dataCache[iconName]["tableName"] != dataCache["tableName"] || 
            dataCache[iconName]["colName"] != dataCache["colName"]) {
            return false;
        }
        return true;
    }

    function getDataCacheHTML(iconName) {
        const mainDisplayArea = document.getElementById("main-display-area");
        if (checkDataCacheExist(iconName)) {
            // exist!
            console.log("exist!");
            mainDisplayArea.innerHTML = dataCache[iconName]["html"];

            if (iconName != "table-icon"
                 && dataCache[iconName]['data']["label"] != null
                 && dataCache[iconName]['data']["Compression Time (ms)"] != null 
                 && dataCache[iconName]['data']["Compressed Size (byte)"] != null) {
                    injectChartDefault(iconName, 
                        dataCache[iconName]['data']["label"], 
                        Object.values(dataCache[iconName]['data']["Compressed Size (byte)"]),
                        Object.values(dataCache[iconName]['data']["Compression Time (ms)"])
                    );
            }
            return;
        }
        // show default result
        mainDisplayArea.innerHTML = getDefaultHTML(iconName);
        // add charts
        injectChartDefault(iconName);
    }

    function getDefaultHTML(iconName) {
        if (iconName == "box-chart-icon") {
            return `<div class="toolbar" id="graph-tool">
                    <div class="toolbar-left">
                        <span class="toolbar-title">Result Preview </span> 
                        <span class="toolbar-name"> Example: Compression info. for table <span class="preview-title" id="preview-table"> dna_seq </span> column <span class="preview-title"  id="preview-col"> exp_log </span>. </span>
                    </div>
                </div>
                <div class="preview-chart-wrapper">
                    <div class="row-chart-container">
                        <div class="chart-display">
                            <div id="${iconName}-default"></div>
                        </div>
                    </div>
                    <div class="query-sample-container">
                        <div class="query-label"> Query example: </div>
                        <div class="query-box">
                                | SELECT * FROM comp_size_info_dna_seq_exp_log;
                        </div>
                    </div>
                </div>`;
        }
        else if (iconName == "word-cloud-chart-icon") {
            return `<div class="toolbar" id="graph-tool">
                    <div class="toolbar-left">
                        <span class="toolbar-title">Result Preview </span> 
                        <span class="toolbar-name"> Example: Compression info. for table <span class="preview-title" id="preview-table"> dna_seq </span> column <span class="preview-title"  id="preview-col"> exp_log </span>. </span>
                    </div>
                </div>
                <div class="preview-chart-wrapper">
                    <div class="row-chart-container">
                        <div id="word-cloud-container"></div>
                            <script>
                                <!-- chart code will be here -->
                            </script>
                    </div>
                    <div class="query-sample-container">
                        <div class="query-label"> Query example: </div>
                        <div class="query-box">
                                | SELECT * FROM comp_size_info_dna_seq_exp_log;
                        </div>
                    </div>
                </div>`;
        }
        else if (iconName == "bar-chart-icon" || iconName == "line-chart-icon" 
            || iconName == "pie-chart-icon" 
            || iconName == "area-chart-icon" || iconName == "radar-chart-icon"
            || iconName == "scatter-chart-icon" || iconName == "statistic-chart-icon"
            || iconName == "timeline-chart-icon" || iconName == "word-cloud-chart-icon") 
        {   
            return `<div class="toolbar" id="graph-tool">
                    <div class="toolbar-left">
                        <span class="toolbar-title">Result Preview </span> 
                        <span class="toolbar-name"> Example: Compression info. for table <span class="preview-title" id="preview-table"> dna_seq </span> column <span class="preview-title"  id="preview-col"> exp_log </span>. </span>
                    </div>
                </div>
                <div class="preview-chart-wrapper">
                    <div class="row-chart-container">
                        <div class="chart-display">
                            <canvas id="${iconName}-default"></canvas>
                        </div>
                    </div>
                    <div class="query-sample-container">
                        <div class="query-label"> Query example: </div>
                        <div class="query-box">
                                | SELECT * FROM comp_size_info_dna_seq_exp_log;
                        </div>
                    </div>
                </div>`;
        }
        else if (iconName == "default") {
            return `
                <div class="toolbar" id="graph-tool">
                                            <div class="toolbar-left">
                                                <span class="toolbar-title">Result Preview </span> 
                                                <span class="toolbar-name"> No result available </span>
                                            </div>
                                        </div>
                `;
        }
        else {
            console.error("Unrecoginized icon name");
        }
    }

    function injectChartDefault(iconName,
        labels = ['Uncompress', 'RLE', 'TADOC', 'LZW', 'PGLZ', 'LZ4'],
        sizes = [929, 438, 92, 62, 100, 200],
        times = [7.715, 12.146, 0, 117.45, 11.355, 3.182]
    ) {
        // const labels = ['Uncompress', 'RLE', 'TADOC', 'LZW', 'PGLZ', 'LZ4'];
        // const sizes = [929, 438, 92, 62, 100, 200];
        // const times = [7.715, 12.146, 0, 117.45, 11.355, 3.182];
        if (iconName == "bar-chart-icon") {
            const ctx = document.getElementById('bar-chart-icon-default').getContext('2d');
            const barChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Compressed Size',
                            data: sizes,
                            backgroundColor: 'rgba(54, 162, 235, 0.6)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1,
                            yAxisID: 'y-axis-1'
                        },
                        {
                            label: 'Compression Time',
                            data: times,
                            backgroundColor: 'rgba(255, 99, 132, 0.6)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1,
                            yAxisID: 'y-axis-2'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        'y-axis-1': {
                            type: 'linear',
                            position: 'left',
                            ticks: {
                                beginAtZero: true,
                                stepSize: 100,
                                font: { size: 14 }
                            },
                            title: {
                                display: true,
                                text: 'Compressed Size (Byte)',
                                font: { size: 15 }
                            }
                        },
                        'y-axis-2': {
                            type: 'linear',
                            position: 'right',
                            ticks: {
                                beginAtZero: true,
                                stepSize: 0.2,
                                font: { size: 14 }
                            },
                            title: {
                                display: true,
                                text: 'Compression Time (ms)',
                                font: { size: 15 }
                            },
                            grid: {
                                drawOnChartArea: false // only want the grid lines for one axis to show up
                            }
                        },
                        x: {
                            ticks: {
                                font: { size: 14 }
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            labels: {
                                font: {
                                    size: 14 // Set the font size for legend labels
                                }
                            }
                        }
                    }
                }
            });
        }
        else if (iconName == "line-chart-icon") {
            const ctx = document.getElementById('line-chart-icon-default').getContext('2d');
            const lineChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Compressed Size',
                            data: sizes,
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1,
                            fill: true,
                            yAxisID: 'y-axis-1'
                        },
                        {
                            label: 'Compression Time',
                            data: times,
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1,
                            fill: true,
                            yAxisID: 'y-axis-2'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        'y-axis-1': {
                            type: 'linear',
                            position: 'left',
                            ticks: {
                                beginAtZero: true,
                                stepSize: 20,
                                font: { size: 14 }
                            },
                            title: {
                                display: true,
                                text: 'Compressed Size (Byte)',
                                font: { size: 15 }
                            }
                        },
                        'y-axis-2': {
                            type: 'linear',
                            position: 'right',
                            ticks: {
                                beginAtZero: true,
                                stepSize: 20,
                                font: { size: 14 }
                            },
                            title: {
                                display: true,
                                text: 'Compression Time (ms)',
                                font: { size: 15 }
                            },
                            grid: {
                                drawOnChartArea: false // only want the grid lines for one axis to show up
                            }
                        },
                        x: {
                            ticks: {
                                font: { size: 14 }
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            labels: {
                                font: {
                                    size: 14 // Set the font size for legend labels
                                }
                            }
                        }
                    }
                }
            });
        }
        
        else if (iconName == "pie-chart-icon") {
            const ctx = document.getElementById('pie-chart-icon-default').getContext('2d');         
            const doughnutChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Compressed Size (Byte)',
                            data: sizes,
                            backgroundColor: [
                                'rgba(54, 162, 235, 0.6)',
                                'rgba(255, 99, 132, 0.6)',
                                'rgba(255, 205, 86, 0.6)',
                                'rgba(75, 192, 192, 0.6)',
                                'rgba(153, 102, 255, 0.6)',
                                'rgba(255, 159, 64, 0.6)'
                            ],
                            borderColor: [
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 99, 132, 1)',
                                'rgba(255, 205, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)'
                            ],
                            borderWidth: 1
                        },
                        {
                            label: 'Compression Time (ms)',
                            data: times,
                            backgroundColor: [
                                'rgba(75, 192, 192, 0.3)',
                                'rgba(153, 102, 255, 0.3)',
                                'rgba(255, 159, 64, 0.3)',
                                'rgba(54, 162, 235, 0.3)',
                                'rgba(255, 99, 132, 0.3)',
                                'rgba(255, 205, 86, 0.3)'
                            ],
                            borderColor: [
                                'rgba(75, 192, 192, 0.5)',
                                'rgba(153, 102, 255, 0.5)',
                                'rgba(255, 159, 64, 0.5)',
                                'rgba(54, 162, 235, 0.5)',
                                'rgba(255, 99, 132, 0.5)',
                                'rgba(255, 205, 86, 0.5)'
                            ],
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                font: {
                                    size: 14 // Set the font size for legend labels
                                },
                                generateLabels: function(chart) {
                                    const datasets = chart.data.datasets;
                                    return datasets.map((dataset, i) => ({
                                        text: dataset.label,
                                        fillStyle: dataset.backgroundColor[0], // Use the first color of the dataset
                                        strokeStyle: dataset.borderColor[0],
                                        lineWidth: dataset.borderWidth,
                                        hidden: false,
                                        index: i
                                    }));
                                }
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    let label = context.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    label += context.raw;
                                    return label;
                                }
                            }
                        }
                    }
                }
            });
        } 
        
        else if (iconName == "box-chart-icon") {
            // Function to generate random data
            // function generateRandomData(min, max, count) {
            //     const data = [];
            //     for (let i = 0; i < count; i++) {
            //         data.push(Math.random() * (max - min) + min);
            //     }
            //     return data;
            // }

            // // Generate random data for compressed sizes for each algorithm
            // const compressedSizeData = labels.map(label => generateRandomData(50, 1000, 10)); // Generating 10 data points for each
            // const compressionTimeData = labels.map(label => generateRandomData(0, 120, 10)); // Generating 10 data points for each

            function generateRandomDataAroundMedian(median, variability, count) {
                const data = [];
                for (let i = 0; i < count; i++) {
                    // Generate data centered around the median with some variability
                    const deviation = (Math.random() - 0.5) * 2 * variability; // Random deviation
                    data.push(median + deviation);
                }
                return data;
            }

            // Generate random data for compressed sizes and compression times
            const variabilitySize = 50; // Adjust variability to scale the spread of data around the median
            const variabilityTime = 10; // Adjust variability for time data

            const compressedSizeData = sizes.map(median => generateRandomDataAroundMedian(median, variabilitySize, 10)); // Generating 10 data points for each
            const compressionTimeData = times.map(median => generateRandomDataAroundMedian(median, variabilityTime, 10)); // Generating 10 data points for each

            // Prepare data for Plotly
            const sizeTraces = {
                y: compressedSizeData.flat(), // Flatten the array of arrays to a single array
                x: labels.flatMap(label => Array(10).fill(label)), // Repeat each label 10 times
                type: 'box',
                name: 'Compressed Size',
                marker: {
                    color: 'rgba(54, 162, 235, 0.6)'
                }
            };

            const timeTraces = {
                y: compressionTimeData.flat(),
                x: labels.flatMap(label => Array(10).fill(label)), // Repeat each label 10 times
                type: 'box',
                name: 'Compression Time',
                marker: {
                    color: 'rgba(255, 99, 132, 0.6)'
                }
            };

            const data = [sizeTraces, timeTraces]; // Array of both traces

            const layout = {
                title: 'Compression Data',
                yaxis: {
                    title: 'Value',
                    zeroline: true
                },
                xaxis: {
                    title: 'Algorithm' // Title for the categorical axis
                },
                showlegend: true,
                boxmode: 'group' // Group boxes of the different traces for the same x category
            };

            console.log("Plotting box chart");
            Plotly.newPlot('box-chart-icon-default', data, layout);
        }

        else if (iconName == "radar-chart-icon") {
            const ctx = document.getElementById('radar-chart-icon-default').getContext('2d');
            const radarChart = new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Compressed Size (Byte)',
                        data: sizes,
                        fill: true,
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgba(255, 99, 132, 1)'
                    }, {
                        label: 'Compression Time (ms)',
                        data: times,
                        fill: true,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgba(54, 162, 235, 1)'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    elements: {
                        line: {
                            borderWidth: 3
                        }
                    },
                    scales: {
                        r: {
                            angleLines: {
                                display: false
                            },
                            suggestedMin: 0,
                            suggestedMax: 100
                        }
                    }
                }
            });
        }

        else if (iconName == "scatter-chart-icon") {
            const ctx = document.getElementById('scatter-chart-icon-default').getContext('2d');
            const datasets = labels.map((label, index) => {
                return {
                    label: label,
                    data: [{
                        x: sizes[index],
                        y: times[index]
                    }],
                    // backgroundColor: 'rgba(75, 192, 192, 0.5)', // Example styling
                    // borderColor: 'rgba(75, 192, 192, 1)', // Example styling
                };
            });
            console.log("datasets = " + datasets);
            const scatterChart = new Chart(ctx, {
                type: 'scatter',
                data: {
                    datasets: datasets,
                },
                options: {
                    scales: {
                        x: {
                            type: 'linear',
                            position: 'bottom',
                            // min: -15,
                            // max: 15
                        },
                        y: {
                            // min: -10,
                            // max: 15
                        }
                    },
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const label = context.dataset.label || '';
                                    const data = context.parsed;
                                    return `${label}: (x: ${data.x}, y: ${data.y})`;
                                }
                            }
                        }
                    }
                }
            });
        }

        else if (iconName == "word-cloud-chart-icon") {
            const words = [
                {text: 'Uncompress', size: 10},
                {text: 'RLE', size: 15},
                {text: 'TADOC', size: 20},
                {text: 'LZW', size: 25},
                {text: 'PGLZ', size: 30},
                {text: 'LZ4', size: 35}
            ];
            var data = [
                {"x": "Mandarin chinese", "value": 1090000000, category: "Sino-Tibetan"},
                {"x": "English", "value": 983000000, category: "Indo-European"},
                {"x": "Hindustani", "value": 544000000, category: "Indo-European"},
                {"x": "Spanish", "value": 527000000, category: "Indo-European"},
                {"x": "Arabic", "value": 422000000, category: "Afro-Asiatic"},
                {"x": "Malay", "value": 281000000, category: "Austronesian"},
                {"x": "Russian", "value": 267000000, category: "Indo-European"},
                {"x": "Bengali", "value": 261000000, category: "Indo-European"},
                {"x": "Portuguese", "value": 229000000, category: "Indo-European"},
                {"x": "French", "value": 229000000, category: "Indo-European"},
                {"x": "Hausa", "value": 150000000, category: "Afro-Asiatic"},
                {"x": "Punjabi", "value": 148000000, category: "Indo-European"},
                {"x": "Japanese", "value": 129000000, category: "Japonic"},
                {"x": "German", "value": 129000000, category: "Indo-European"},
                {"x": "Persian", "value": 121000000, category: "Indo-European"}
              ];
            
            var chart = anychart.tagCloud(data);
            
            // set a chart title
            chart.title('15 most spoken languages')
            // set an array of angles at which the words will be laid out
            chart.angles([0])
            // enable a color range
            chart.colorRange(true);
            // set the color range length
            chart.colorRange().length('80%');

            // display the word cloud chart
            chart.container("word-cloud-container");
            chart.draw();

            // Additional responsiveness
            chart.listen("chartDraw", function() {
                adjustWordCloudPosition(chart);
            });

            function adjustWordCloudPosition(chart) {
                // You may want to adjust positioning or scaling further based on the rendering
                var bounds = chart.getBounds();
                if (bounds.width < chart.container().clientWidth) {
                    chart.scale((chart.container().clientWidth / bounds.width) * 0.9);
                }
            }
        }
    }

    // Identify all chart canvas elements
    // var charts = document.querySelectorAll('.chart canvas');
    var chartObjects = document.querySelectorAll('.chart');
    chartObjects.forEach(chart => {
        chart.addEventListener('click', () => {
            // Highlighting effect
            iconObjects.forEach(icon => icon.classList.remove('highlighted'));
            chartObjects.forEach(chart => chart.classList.remove('highlighted'));
            chart.classList.add('highlighted');

            // Get element id, and show corresponding page
            const chartId = chart.id;
            console.log("chartId = " + chartId);
            getDataCacheHTML(chartId);
        });
    });
});

// tooltip for the database icon, show db information
document.addEventListener('DOMContentLoaded', () => {
    const tooltip = document.querySelector('.tooltip');
    const databaseInfo = document.getElementById('db-icon');

    databaseInfo.addEventListener('mouseover', () => {
        tooltip.classList.add('show');
    });

    databaseInfo.addEventListener('mouseout', (event) => {
        if (!tooltip.contains(event.relatedTarget)) {
            tooltip.classList.remove('show');
        }
    });

    tooltip.addEventListener('mouseover', () => {
        tooltip.classList.add('show');
    });

    tooltip.addEventListener('mouseout', (event) => {
        if (!databaseInfo.contains(event.relatedTarget)) {
            tooltip.classList.remove('show');
        }
    });
});


// switch tab page!
document.addEventListener("DOMContentLoaded", function() {
    const tabButtons = document.querySelectorAll('.tab-button');
    
//  button active == blue color + blue underline
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const contentId = this.textContent.trim() === 'Query Result' ? 'data-tab' : this.textContent.trim() === 'Scheme Comparison' ? 'chart-tab' : 'sum-tab';
            console.log("contentId = ", contentId);
            document.getElementById(contentId).classList.add('active');
        });
    });
  
//   hide and show corresponding pages
//   page-origin
    const sidebar = document.querySelector('.sidebar');
    const resizeHandle = document.querySelector('.resize-handle');
    const displayContainer = document.getElementById('page-org');
    const dataContainer = document.querySelector('.data-table-container');
    
//   page-graph
    const graphContainer = document.querySelector('.graph-container');
//   tabs
    const dataTab = document.getElementById('data-tab');
    const chartTab = document.getElementById('chart-tab');
    const sumTab = document.getElementById('sum-tab');
  
    dataTab.addEventListener('click', () => {
        showDataContainer();
    });

    chartTab.addEventListener('click', () => {
        showGraphContainer();
    });
    
//     TODO
    // sumTab.addEventListener('click', () => {
    //     showSumContainer();
    // });
  
    function showDataContainer() {
        sidebar.classList.remove('hidden');
        displayContainer.classList.remove('hidden');
        graphContainer.classList.add('hidden');
    }
    
    function showGraphContainer() {
        sidebar.classList.add('hidden');
        displayContainer.classList.add('hidden');
        graphContainer.classList.remove('hidden');
        // showGraphTable(); // default for the page-graph
    }
    
    // default for the page-graph
    function showGraphTable() {
        const tableHead = document.getElementById('preview-table-head');
        const tableBody = document.getElementById('preview-table-body');
        const rowsPerPageSelect = document.getElementById('preview-rows-per-page');
        const prevPageButton = document.getElementById('flip-prev-page');
        const nextPageButton = document.getElementById('flip-next-page');
        const pageNumberDisplay = document.getElementById('flip-page-number');
        const totalPageNumberDisplay = document.getElementById('flip-total-page-number');
  
    //     TODO: get result tuple number
        let currentPage = 1;
        let rowsPerPage = parseInt(rowsPerPageSelect.value);
        let totalRows = 389;    // TODO: load rows from table
        let totalPage = parseInt((totalRows + rowsPerPage - 1 ) / rowsPerPage); 

        totalPageNumberDisplay.textContent = totalPage;

        const sampleData = generateSampleData(totalRows);
        const sampleHead = generateSampleTableHeader();

        // TODO: get table header
        function generateSampleTableHeader() {
            return [
              // "#", // 注意，可能要特殊处理一下 id
              "scheme", "space", "compress_time"
              // , "__tag__:__receive_time__", "__tag__:__receive_time__0", "__topic__", "body_bytes_sent", "host", "http_referer", "http_user_agent", "http_x_forwarded_for", "remote_addr", "request_length", "request_method"
            ];
        }

        // TODO: get table tuples
        function generateSampleData(count) {
            return [
                {
                    "scheme": "PGLZ",
                    "space": 0,
                    "compress_time": 0,
                },
                {
                    "scheme": "LZ4",
                    "space": 0,
                    "compress_time": 0,
                },
                {
                    "scheme": "ZSTD",
                    "space": 0,
                    "compress_time": 0,
                },
                {
                    "scheme": "RLE",
                    "space": 0,
                    "compress_time": 0,
                },
                {
                    "scheme": "TADOC",
                    "space": 0,
                    "compress_time": 0,
                },
                {
                    "scheme": "LZW",
                    "space": 0,
                    "compress_time": 0,
                }
            ];
        }

        function renderTable(page) {
            tableHead.innerHTML = '';
            let tr = document.createElement('tr');
            tr.innerHTML = '<th>#</th>';  // id, 注意，可能要特殊处理一下 id
            sampleHead.forEach((head, index) => {
                    // console.log(head);
                tr.innerHTML += `<th>${head}</th>`;
            });
            tableHead.appendChild(tr);
            
            tableBody.innerHTML = '';
            let start = (page - 1) * rowsPerPage;
            let end = start + rowsPerPage;
            let rows = sampleData.slice(start, end);
            rows.forEach((row, index) => {
                let tr = document.createElement('tr');
                tr.innerHTML = `<td>${start + index + 1}</td>`;   // id, 注意，可能要特殊处理一下 id
                sampleHead.forEach((head, hid) => {
                    if ( row.hasOwnProperty(head) )
                        tr.innerHTML += `<td> ${row[head]} </td>`;
                    else {
                        tr.innerHTML += `<td> Nil </td>`; // 注意，可能要特殊处理一下空值情况（pg一般不会出现？
                    }
                });
                tableBody.appendChild(tr);
            });
        }

        function updatePagination() {
            pageNumberDisplay.textContent = currentPage;
        }

        // change the rows to present in current page. load the corresponding slice from the data -- TODO: check when adding more data
        rowsPerPageSelect.addEventListener('change', () => {
            rowsPerPage = parseInt(rowsPerPageSelect.value);
            currentPage = 1;
            renderTable(currentPage);
            updatePagination();
        });

        // turn to the previous page
        prevPageButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderTable(currentPage);
                updatePagination();
            }
        });

        // turn to the next page
        nextPageButton.addEventListener('click', () => {
            if (currentPage < Math.ceil(totalRows / rowsPerPage)) {
                currentPage++;
                renderTable(currentPage);
                updatePagination();
            }
        });

        renderTable(currentPage);
        updatePagination();
    }
    
    showDataContainer();

});

// page-org: sidebar loading
document.addEventListener('DOMContentLoaded', () => {
    // click on headers, show fields in the side bar    
    const headers = document.querySelectorAll('.toggle-field-header');
  
    // Sample data -- TODO: extract data and type
    const sampleData = {
        "show-field": {
            "long": ["body_bytes_sent", "bytes_sent", "connection", "connection_requests", "content_length"],
            "text": ["content_type", "host", "hostname", "http_referer", "http_user_agent", "http_x_forwarded"],
            "date": ["request_time"],
        },
        "index-field": {
            "text": ["content_type", "host", "hostname", "http_referer", "http_user_agent", "http_x_forwarded"],
        },
        "other-field": {
            "/": ["id", "__tag__"],
        }
    };

    headers.forEach(header => {
        const targetId = header.getAttribute('data-target');
        const icon = header.querySelector('.toggle-icon');
      
        header.nextElementSibling.style.display = 'none';
      
        header.addEventListener('click', function() {
            // const tableName = document.querySelector('.table-name').textContent;
            // console.log("table name = " + tableName);
            header.classList.toggle('expanded');
            const fieldList = header.nextElementSibling;
            fieldList.style.display = fieldList.style.display === 'block' ? 'none' : 'block';
            icon.style.transform = fieldList.style.display === 'block' ? 'rotate(90deg)' : 'rotate(0deg)';
        });

        const fieldList = header.nextElementSibling;
        const data = sampleData[targetId];
      
        if (Object.keys(data).length == 0) {
            fieldList.innerHTML = `<p class="empty-text"> Show all fields. </p>`;
        }
        for (const type in data) {
            if (data.hasOwnProperty(type)) {
                data[type].forEach(field => {
                    const fieldItem = document.createElement('li');
                    fieldItem.className = 'field-item';
                    switch(type) {
                      case 'long':
                        fieldItem.innerHTML = `<div class="icon-square green"> <i class="fas fa-l"></i></div>${field}`;
                        break;
                      case 'text':
                        fieldItem.innerHTML = `<div class="icon-square blue"> <i class="fas fa-t"></i></div>${field}`;
                        break;
                      case 'int':
                        fieldItem.innerHTML = `<div class="icon-square green"> <i class="fas fa-i"></i></div>${field}`;
                        break;
                      case 'integer':
                        fieldItem.innerHTML = `<div class="icon-square green"> <i class="fas fa-i"></i></div>${field}`;
                        break;
                      case 'date':
                        fieldItem.innerHTML = `<div class="icon-square green"> <i class="fas fa-d"></i></div>${field}`;
                        break;
                      default:
                        fieldItem.innerHTML = `<div class="icon-square grey"> <span class="symbol">/</span></div>${field}`;
                        break;
                    }
                    // fieldItem.innerHTML = `<i class="fas fa-table table-icon"></i>${field}`;
                    fieldList.appendChild(fieldItem);
                });
            }
        }
    });
  
    
// 2.  Search for attributes in sidebar
    const searchButton = document.getElementById('attr-searchButton');
    const searchField = document.getElementById('attribute-searchField');
    const messageContainer = document.getElementById('message-container');
  
    searchButton.addEventListener('click', function() {
        const searchTerm = searchField.value.trim().toLowerCase();
        
        if (searchTerm) {
            showMessage(`Searching for attribute: ${searchTerm}`);
            // searchField.value = ''; // Clear the input field
            // TODO: add filtering to the fields and tables below
            
        }
    });
    
    // Filter fields with input
    const allfieldsValues = extractInnermostValues(sampleData);
    searchField.addEventListener('input', () => {
        const query = searchField.value.toLowerCase();
        const fieldLists = document.querySelectorAll('.toggle-field-list');
        fieldLists.forEach(list => {
            const items = list.querySelectorAll('.field-item');
            let count = 0;
            items.forEach(item => {
                const text = item.textContent.toLowerCase();
                if (text.includes(query)) {
                    item.style.display = '';
                    count += 1;
                } else {
                    item.style.display = 'none';
                }
            });
            // Show or hide the 'No fields available' message
            const emptyText = list.querySelector('.empty-text');
            if (count == 0) { // no match
                if (!emptyText) {
                    const message = document.createElement('p');
                    message.className = 'empty-text';
                    message.textContent = 'No fields available.';
                    list.appendChild(message);
                }
            } else {
                if (emptyText) {
                    emptyText.remove();
                }
            }
        });
    });
    
//     extract the most inner values from dict
    function extractInnermostValues(obj) {
        let result = [];

        function recurse(obj) {
            if (Array.isArray(obj)) {
                result = result.concat(obj);
            } else if (typeof obj === 'object' && obj !== null) {
                for (const key in obj) {
                    recurse(obj[key]);
                }
            }
        }

        recurse(obj);
        return result;
    }
    
    function showMessage(message) {
        messageContainer.textContent = message;
        messageContainer.classList.add('show');
        setTimeout(() => {
            messageContainer.classList.remove('show');
        }, 2000); // Hide message after 2 seconds
    }
  
});

// page-org: sidebar resizing
document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.sidebar');
    const resizeHandle = document.querySelector('.resize-handle');
    const displayContainer = document.querySelector('.display-container');
    let isResizing = false;

    resizeHandle.addEventListener('mouseover', () => {
        sidebar.classList.add('resizing');
    });

    resizeHandle.addEventListener('mouseout', () => {
        if (!isResizing) {
            sidebar.classList.remove('resizing');
        }
    });

    resizeHandle.addEventListener('mousedown', (e) => {
        isResizing = true;
        document.body.style.cursor = 'ew-resize';
        sidebar.classList.add('resizing');
    });

    document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;
        const newWidth = e.clientX - sidebar.getBoundingClientRect().left;
        sidebar.style.width = `${newWidth}px`;
        adjustDisplayContainerWidth();
    });

    document.addEventListener('mouseup', () => {
        isResizing = false;
        document.body.style.cursor = '';
        sidebar.classList.remove('resizing');
    });
  
    function adjustDisplayContainerWidth() {
        const sidebarWidth = sidebar.offsetWidth;
        const displayWidth = window.innerWidth - sidebarWidth;
        displayContainer.style.width = `${displayWidth}px`;
    }
    adjustDisplayContainerWidth(); // Initial adjustment
});

// page-graph: charts
document.addEventListener('DOMContentLoaded', function() {
    const barCtx = document.getElementById('barChart').getContext('2d');
    const pieCtx = document.getElementById('pieChart').getContext('2d');
    const radarCtx = document.getElementById('radarChart').getContext('2d');

    // Bar Chart
    new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: ['RLE', 'LZW', 'TADOC', 'PGLZ', 'LZ4'],
            datasets: [{
                label: '# of Requests',
                data: [343, 324, 8, 121, 1256],
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Pie Chart
    new Chart(pieCtx, {
        type: 'pie',
        data: {
            labels: ['POST', 'PUT', 'HEAD', 'DELETE', 'GET'],
            datasets: [{
                data: [343, 324, 8, 121, 1256],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

    // Radar Chart
    new Chart(radarCtx, {
        type: 'radar',
        data: {
            labels: ['RLE', 'LZW', 'TADOC', 'PGLZ', 'LZ4'],
            datasets: [{
                label: 'Compressed size',
                data: [343, 324, 8, 121, 1256],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                pointBackgroundColor: 'rgba(75, 192, 192, 1)',
                pointBorderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    beginAtZero: true
                }
            }
        }
    });
  
    // Toggle charts section
    const toggleCharts = document.getElementById('toggle-charts');
    const chartsSection = document.getElementById('charts-section');
    const arrow = document.querySelector('.chart-container').querySelector('.toggle-icon');

    toggleCharts.addEventListener('click', () => {
        chartsSection.classList.toggle('hidden');
        arrow.classList.toggle('up');
    });
  
    arrow.addEventListener('click', () => {
        chartsSection.classList.toggle('hidden');
        arrow.classList.toggle('up');
    });



});

document.addEventListener('DOMContentLoaded', () => {
    // clicking actions defined for fields in sidebar and the table header
    // Assuming each sidebar field has a unique ID that corresponds to a class in the table column
    const sidebarFields = document.querySelectorAll('.field-item');
    sidebarFields.forEach(field => {
        // console.log("field = " + field.textContent);
        field.addEventListener('click', () => {
            // Remove highlight from all columns
            const allColumns = document.querySelectorAll('.data-table th');
            allColumns.forEach(col => {
                // col.style.backgroundColor = ''; // Reset background color
                col.classList.remove('highlight-dark');
            });
            const allTabs = document.querySelectorAll('.data-table td');
            allTabs.forEach(tab => {
                // tab.style.backgroundColor = '';
                tab.classList.remove('highlight');
            });

            // Add highlight to the clicked column
            let columnName = field.textContent.trim();
            if (columnName[0] == "/") {
                columnName = columnName.split('/').pop().trim();
            }
            
            const targetColumn = document.querySelector(`.data-table th.${columnName}`);
            if (targetColumn) {
                // targetColumn.style.backgroundColor = 'lightblue';
                targetColumn.classList.add('highlight-dark');
                const targetTabs = document.querySelectorAll(`.data-table td.${columnName}`);
                if (targetTabs) {
                    targetTabs.forEach(tab => {
                        tab.classList.add('highlight');
                    });
                }
            }
        });

        field.addEventListener('dblclick', () => {
            // Remove highlight from the double-clicked column
            const columnName = field.textContent.trim();
            const targetColumn = document.querySelector(`.data-table th.${columnName}`);
            if (targetColumn) {
                targetColumn.style.backgroundColor = '';
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // Code to handle the expansion of table cell text
    const dataTable = document.querySelector('.data-table');

    dataTable.addEventListener('click', function(event) {
        const target = event.target;

        if (target.tagName === 'TD' && target.classList.contains('collapsible')) {
            target.classList.toggle('expanded'); // Toggle the expanded class to show/hide full text
        }
    });

    // Rest of your existing JavaScript code...
});