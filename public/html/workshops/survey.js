const allResponsesDiv = document.getElementById('allResponses');

// const backendUrl = 'https://uvarc-unified-service-prod.pods.uvarc.io';
const backendUrl = 'http://localhost:5000';

const charts = {};

function createChart(surveys, id, title, chartType) {
    const canvas = document.getElementById(id);
    const ctx = canvas.getContext('2d');

    if (charts[id])
        charts[id].destroy();

    // replace school names with abbreviations
    const schoolAbbreviations = {
        'College and Graduate School of Arts & Sciences': 'AS',
        'Darden School of Business': 'DA',
        'Frank Batten School of Leadership and Public Policy': 'BA',
        'McIntire School of Commerce': 'MC',
        'School of Architecture': 'AR',
        'School of Continuing & Professional Studies': 'CP',
        'School of Data Science': 'DS',
        'School of Education and Human Development': 'ED',
        'School of Engineering and Applied Science': 'EN',
        'School of Law': 'LW',
        'School of Medicine': 'MD',
        'School of Nursing': 'NU',
        'UVA Wise': 'Wise',
    };

    const invertedAbbreviations = Object.fromEntries(
        Object.entries(schoolAbbreviations).map(([key, value]) => [value, key])
    );

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
        indexAxis: 'y',
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
            tooltip: {
                callbacks: {
                    title: function (context) {
                        return invertedAbbreviations[context[0].label] ?? context[0].label;
                    },
                    // label: function (context) {
                    //     const label = context.dataset.label || '';
                    //     const value = context.parsed || 0;
                    //     return `${label}: ${value}`;
                    // }
                }
            }
        }, scales: {
            x: chartType == 'bar' ? {
                stacked: true,
                ticks: {
                    autoSkip: false,
                    font: {
                        size: 16
                    }
                }
            } : undefined,
            y: chartType == 'bar' ? {
                beginAtZero: true,
                ticks: {
                    autoSkip: false,
                    font: {
                        size: 16
                    }
                }
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

    const topicTransformations = {
        'Deep Learning/Neural Networks': 'Deep Learning/Neural Networks',
        'High Performance Computing': 'High Performance Computing',
        'Matlab': 'Matlab',
        'Programming (Julia, C, C++, OpenMP, Fortran etc.)': 'Programming',
        'Python': 'Python',
        'Shiny': 'Shiny',
        'Data transfer with Globus': 'Data Transfer with Globus',
        'Applications (Deploying Web Apps for Publication)': 'Web Applications',
        'Containers (Building and Using Containers)': 'Containers',
        'R': 'R',
        'Computational Biophysics/Chemistry (drug discovery, large-scale bio-molecular simulations)': 'Computational Biophysics/Chemistry',
        'Bioinformatics': 'Bioinformatics',
        'Other': 'Other',
    }

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
            topicsCounts[topicTransformations[topic] ?? topic] = (topicsCounts[topic] || 0) + 1;
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
