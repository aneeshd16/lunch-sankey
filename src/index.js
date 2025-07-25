const TRANSACTIONS_ENDPOINT = "https://dev.lunchmoney.app/v1/transactions";
const CATEGORY_ENDPOINT = "https://dev.lunchmoney.app/v1/categories/";

document.addEventListener("DOMContentLoaded", function () {
    const generateBtn = document.getElementById("generate-btn");
    const refreshBtn = document.getElementById("refresh-btn");
    const downloadBtn = document.getElementById("download-btn");
    const accessTokenInput = document.getElementById("access-token");
    const loader = document.getElementById("loader");
    const errorMessage = document.getElementById("error-message");
    const instructions = document.getElementById("instructions");
    const successContainer = document.getElementById("success-container");
    const inputContainer = document.getElementById("input-container");
    const datePickerRangeStart = document.getElementById("datepicker-range-start");
    const datePickerRangeEnd = document.getElementById("datepicker-range-end");

    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);


    datePickerRangeStart.value = firstDay.toISOString().split('T')[0];
    datePickerRangeEnd.value = lastDay.toISOString().split('T')[0];

    generateBtn.addEventListener("click", generateChart);
    refreshBtn.addEventListener("click", generateChart);

    async function generateChart() {
        const accessToken = accessTokenInput.value.trim();

        if (!accessToken) {
            showError("Please enter your API key.");
            return;
        }

        showLoader();

        const startDate = datePickerRangeStart.value;
        const endDate = datePickerRangeEnd.value;

        const response = await fetch(TRANSACTIONS_ENDPOINT + `?start_date=${startDate}&end_date=${endDate}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (response.status !== 200) {
            showError(
                `The LunchMoney API returned a ${response.status} status code. Please check your access token.`
            );
            return;
        }

        const data = await response.json();

        const incomes = [],
            expenses = [],
            groups = {};

        let currency = null;

        for (const transaction of data.transactions) {
            if (transaction.exclude_from_totals) {
                continue;
            }
            if (transaction.is_income) {
                incomes.push(transaction);
            } else {
                if (transaction.category_group_id) {
                    if (!groups[transaction.category_group_id]) {
                        const categoryResponse = await fetch(
                            CATEGORY_ENDPOINT + transaction.category_group_id,
                            {
                                headers: {
                                    Authorization: `Bearer ${accessToken}`,
                                },
                            }
                        );
                        const data = await categoryResponse.json();
                        groups[transaction.category_group_id] = {
                            name: data.name,
                            sum: 0,
                        };
                    }
                    groups[transaction.category_group_id].sum += transaction.to_base;
                    expenses.push({
                        ...transaction,
                        category_group_name: groups[transaction.category_group_id].name,
                    });
                } else {
                    expenses.push(transaction);
                }
            }
        }

        google.charts.load("current", { packages: ["sankey"] });
        google.charts.setOnLoadCallback(drawChart);


        function drawChart() {
            const data = new google.visualization.DataTable();
            data.addColumn("string", "From");
            data.addColumn("string", "To");
            data.addColumn("number", "Amount");
            data.addRows(
                incomes.map((transaction) => [
                    transaction.category_name,
                    "Total Income",
                    -1 * transaction.to_base,
                ])
            );
            data.addRows(
                expenses
                    .filter((transaction) => transaction.category_group_name)
                    .map((transaction) => [
                        transaction?.category_group_name?.toString(),
                        transaction.category_name,
                        transaction.to_base,
                    ])
            );
            data.addRows(
                expenses
                    .filter((transaction) => !transaction.category_group_name)
                    .map((transaction) => [
                        "Total Income",
                        transaction.category_name,
                        transaction.to_base,
                    ])
            );
            data.addRows(
                Object.values(groups).map((group) => [
                    "Total Income",
                    group.name,
                    group.sum,
                ])
            );

            const options = {
                width: 900,
                height: 600,
                sankey: { node: { nodePadding: 12 } },
            };

            const chart = new google.visualization.Sankey(
                document.getElementById("sankey")
            );
            google.visualization.events.addListener(chart, 'ready', function () {
                downloadBtn.disabled = false;
                downloadBtn.onclick = downloadChart;
            });
            chart.draw(data, options);
            showSuccess();
        }
    }

    function downloadChart() {
        const chartContainer = document.getElementById('sankey');

        const svgContent = chartContainer.getElementsByTagName('svg')[0];

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const svgRect = svgContent.getBoundingClientRect();
        canvas.width = svgRect.width;
        canvas.height = svgRect.height;

        const svgString = new XMLSerializer().serializeToString(svgContent);
        const svg = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });

        const URL = window.URL || window.webkitURL || window;
        const svgUrl = URL.createObjectURL(svg);

        const img = new Image();

        img.onload = function () {
            ctx.drawImage(img, 0, 0);
            URL.revokeObjectURL(svgUrl);

            const link = document.createElement('a');
            link.download = 'sankey_chart.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        };

        img.src = svgUrl;
    }

    function showLoader() {
        loader.classList.remove("hidden");
        errorMessage.classList.add("hidden");
        successContainer.classList.add("hidden");
        generateBtn.disabled = true;
        refreshBtn.disabled = true;
        downloadBtn.disabled = true;
    }

    function showError(message) {
        loader.classList.add("hidden");
        errorMessage.textContent = message;
        errorMessage.classList.remove("hidden");
        successContainer.classList.add("hidden");
        generateBtn.disabled = false;
        refreshBtn.disabled = false;
    }

    function showSuccess() {
        loader.classList.add("hidden");
        errorMessage.classList.add("hidden");
        successContainer.classList.remove("hidden");
        instructions.classList.add("hidden");
        inputContainer.classList.add("hidden");
        generateBtn.disabled = false;
        refreshBtn.disabled = false;
    }
});
