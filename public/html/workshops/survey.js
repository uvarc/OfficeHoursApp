const allResponsesDiv = document.getElementById('allResponses');

const backendUrl = window.location.origin === 'http://localhost:3000' ? 'http://localhost:5000' : 'https://uvarc-unified-service-prod.pods.uvarc.io';
// const backendUrl = 'https://uvarc-unified-service-test.pods.uvarc.io';

const charts = {};

// replace school names with abbreviations
const schoolAbbreviations = {
    'College and Graduate School of Arts & Sciences [AS]': 'AS',
    'Darden School of Business [DA]': 'DA',
    'Frank Batten School of Leadership and Public Policy [BA]': 'BA',
    'McIntire School of Commerce [MC]': 'MC',
    'School of Architecture [AR]': 'AR',
    'School of Continuing & Professional Studies [CP]': 'CP',
    'School of Data Science [DS]': 'DS',
    'School of Education and Human Development [ED]': 'ED',
    'School of Engineering and Applied Science [EN]': 'EN',
    'School of Law [LW]': 'LW',
    'School of Medicine [MD]': 'MD',
    'School of Nursing [NU]': 'NU',
    'UVA Wise [Wise]': 'Wise',
};

function createChart(surveys, id, title, chartType, backgroundColors) {
    const canvas = document.getElementById(id);
    const ctx = canvas.getContext('2d');

    if (charts[id])
        charts[id].destroy();

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

    console.log(Object.values(surveys))

    // Copy surveys to summedOtherData, summing all non-schoolAbbreviation keys into 'Other'
    const summedOtherData = {};
    for (const key in surveys) {
        if (key === 'Other' && typeof surveys[key] === 'object') {
            for (const subKey in surveys[key]) {
                summedOtherData['Other'] = (summedOtherData['Other'] || 0) + surveys[key][subKey];
            }
        } else {
            summedOtherData[key] = surveys[key];
        }
    }

    const data = {
        labels: Object.keys(summedOtherData),
        datasets: [{
            label: 'Responses',
            data: Object.values(summedOtherData),
            backgroundColor: backgroundColors
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
                    //     // If value = Other, break down count
                    //     const value = context.parsed || 0;
                    //     return `Responses: ${value}`;
                    // }
                    beforeBody: function (context) {
                        console.log(context)
                        const label = context[0].label;
                        if (label === 'Other' && typeof surveys[label] === 'object') {
                            let breakdown = '';
                            for (const [subKey, subValue] of Object.entries(surveys['Other'])) {
                                breakdown += `${subKey}: ${subValue}\n`;
                            }
                            return breakdown;
                        } else {
                            return '';
                        }
                    },
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

async function refresh(inputData = null) {
    if (inputData !== null) {
        data = inputData;
        return;
    }

    const response = await fetch(backendUrl + '/uvarc/api/workshops/survey/data', {
        method: "POST"
    });
    data = await response.json();
    localStorage.setItem('workshopSurveyData', JSON.stringify(data));
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

    const unusedHeaders = ['survey_id', 'ResponseId', 'RecordedDate', 'Finished', 'Progress', 'Duration (in seconds)', 'Q3A'];

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

        // On right click, copy the ResponseId to clipboard
        r.addEventListener('contextmenu', (event) => {
            event.preventDefault();
            navigator.clipboard.writeText(row['ResponseId']);
            alert(`Copied ResponseId ${row['ResponseId']} to clipboard`);
        });

        // On hover, show tooltip with ResponseId
        r.addEventListener('mouseover', (event) => {
            r.title = `Response ID: ${row['ResponseId']}`;
        });
    });

    const topicsCounts = {};
    data.forEach(row => {
        row['Q3'].forEach(topic => {
            topicsCounts[topicTransformations[topic] ?? topic] = (topicsCounts[topic] || 0) + 1;
        });
    });
    // Sort topicsCounts by value descending
    const sortedTopicsCounts = Object.fromEntries(
        Object.entries(topicsCounts).sort(([, a], [, b]) => b - a)
    );

    createChart(sortedTopicsCounts, 'topics-chart', 'Topics', 'bar');

    const positionsCounts = getValueCounts(data, 'Q1');
    createChart(positionsCounts, 'positions-chart', 'Role', 'pie');

    // If department is not in schoolAbbreviations, count it as 'Other'
    const adjustedDepartmentsCounts = { 'Other': {} };
    Object.entries(getValueCounts(data, 'Q2')).forEach(([key, value]) => {
        if (key in schoolAbbreviations) {
            adjustedDepartmentsCounts[key] = value;
        } else {
            if (key in adjustedDepartmentsCounts['Other']) {
                adjustedDepartmentsCounts['Other'][key] += value;
            } else {
                adjustedDepartmentsCounts['Other'][key] = value;
            }
            // adjustedDepartmentsCounts['Other'] = (adjustedDepartmentsCounts['Other'] || 0) + value;
        }
    });
    // const departmentsCounts = getValueCounts(data, 'Q2');
    createChart(adjustedDepartmentsCounts, 'departments-chart', 'Schools', 'pie', [
        '#4dc9f6',
        '#f67019',
        '#f53794',
        '#537bc4',

        '#acc236',
        '#166a8f',
        '#00a950',
        '#58595b',
        '#8549ba',
        '#e6194b',
        '#3cb44b',
    ]);
}

function displayFilteredData(checked) {
    const finishedOnly = checked;
    allResponsesDiv.innerHTML = '';

    let newData = data;
    if (finishedOnly) {
        newData = data.filter(item => item.Finished === 'True');
    }

    document.getElementById('response-count').innerText = newData.length;

    displayData(newData);
    document.querySelector('.loading').style.display = 'none';
}

refresh(localStorage.getItem('workshopSurveyData') ? JSON.parse(localStorage.getItem('workshopSurveyData')) : null).then(() => displayFilteredData(true));

document.getElementById('finished-only').addEventListener('change', async (event) => {
    const finishedOnly = event.target.checked;
    displayFilteredData(finishedOnly);
});

document.getElementById('refresh-data').addEventListener('click', async () => {
    await refresh();
    const finishedOnly = document.getElementById('finished-only').checked;
    displayFilteredData(finishedOnly);
});
