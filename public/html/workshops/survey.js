const allResponsesDiv = document.getElementById('allResponses');

const backendUrl = 'https://uvarc-unified-service-prod.pods.uvarc.io';

const charts = {};

function createChart(surveys, id, title, chartType) {
    const canvas = document.getElementById(id);
    const ctx = canvas.getContext('2d');

    if (charts[id])
        charts[id].destroy();

    // replace school names with abbreviations
    const schoolAbbreviations = {
        'College and Graduate School of Arts & Sciences': 'The College',
        'Frank Batten School of Leadership and Public Policy': 'Batten',
        'Darden School of Business': 'Darden',
        'School of Data Science': 'Data Science',
        'McIntire School of Commerce': 'McIntire',
    }

    const abbreviate = (name) => {
        if (name in schoolAbbreviations) {
            return schoolAbbreviations[name];
        }
        return name;
    }

    for (const key in surveys) {
        if (key === 'Other') {
            continue;
        }
        if (key in schoolAbbreviations) {
            surveys[abbreviate(key)] = surveys[key];
            delete surveys[key];
        }
    }

    const data = {
        labels: Object.keys(surveys),
        datasets: [{
            label: 'Responses',
            data: Object.values(surveys),
        }],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: `Survey Responses (by ${title})`,
                font: {
                    size: 20
                }
            },
            legend: {
                display: false,
                position: 'top',
                labels: {
                    font: {
                        size: 16
                    }
                }
            },
            labels: chartType === 'pie' ? {
                render: 'label',
                fontSize: 20,
            } : undefined,
        }, scales: {
            x: chartType == 'bar' ? {
                stacked: true,
                ticks: {
                    autoSkip: false,
                    maxRotation: 90,
                    minRotation: 90,
                    font: {
                        size: 16
                    }
                }
            } : undefined,
            y: chartType == 'bar' ? {
                beginAtZero: true
            } : undefined,
        },
    };

    const chart = new Chart(ctx, {
        type: chartType,
        data: data,
        options: options,
    });

    charts[id] = chart;

    return chart;
}

function getValueCounts(data, key) {
    const counts = {};
    data.forEach(item => {
        const value = item[key];

        if (!value)
            return;

        counts[value] = (counts[value] || 0) + 1;
    });
    return counts;
}

let data = [];

async function refresh() {
    const response = await fetch(backendUrl + '/uvarc/api/workshops/survey/data', {
        method: "POST"
    });
    data = await response.json();
}

function displayData(data) {
    const headers = {
        'Q1': 'Position',
        'Q2': 'Department',
        'Q3': 'Topics',
        'Q4': 'Specific Tools for Topics',
        'Q5': 'Meeting Format',
        'Q6': 'Time',
        'Q7': 'Length',
        'Q8': 'Additional Comments?'
    }

    const headerRow = document.createElement('tr');

    const unusedHeaders = ['ResponseId', 'RecordedDate', 'Finished', 'Progress', 'Duration (in seconds)', 'Q3A'];

    Object.keys(data[0]).forEach(header => {
        if (unusedHeaders.includes(header))
            return;

        const th = document.createElement('th');
        th.innerText = header in headers ? headers[header] : header
        headerRow.appendChild(th);
    });

    allResponsesDiv.appendChild(headerRow);

    data.forEach(row => {
        const r = document.createElement('tr');
        const keys = Object.keys(row);
        r.ariaLabel = row['ResponseId'];

        keys.forEach(key => {
            if (unusedHeaders.includes(key))
                return;

            const td = document.createElement('td');
            if (key === 'Q3') {
                const topicsUl = document.createElement('ul');
                row[key].forEach(topic => {
                    const li = document.createElement('li');
                    li.innerText = topic;
                    topicsUl.appendChild(li);
                });
                const moreTopics = row['Q3A'];
                if (moreTopics) {
                    const moreLi = document.createElement('li');
                    moreLi.innerText = moreTopics;
                    topicsUl.appendChild(moreLi);
                }
                td.appendChild(topicsUl);
            } else {
                td.innerText = row[key];
            }

            r.appendChild(td);
        });

        allResponsesDiv.appendChild(r);
    });

    const topicsCounts = {};
    data.forEach(row => {
        row['Q3'].forEach(topic => {
            topicsCounts[topic] = (topicsCounts[topic] || 0) + 1;
        });
    });
    createChart(topicsCounts, 'topics-chart', 'Topics', 'bar');

    const positionsCounts = getValueCounts(data, 'Q1');
    createChart(positionsCounts, 'positions-chart', 'Positions', 'pie');

    const departmentsCounts = getValueCounts(data, 'Q2');
    createChart(departmentsCounts, 'departments-chart', 'Departments', 'pie');
}

function displayFilteredData(checked) {
    const finishedOnly = checked;
    allResponsesDiv.innerHTML = '';

    let newData = data;
    if (finishedOnly) {
        newData = data.filter(item => item.Finished === 'True');
    }

    displayData(newData);
}

refresh().then(() => displayFilteredData(true));

document.getElementById('finished-only').addEventListener('change', async (event) => {
    const finishedOnly = event.target.checked;
    displayFilteredData(finishedOnly);
});
