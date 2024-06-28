//   The following is extracted directly from SearchOM.js and modified to fit the context of Explore.js
export function countWords(str) {
    const words = str.split(' ');
    const wordCount = {};
    for (let word of words) {
        wordCount[word] = (wordCount[word] || 0) + 1;
    }
    return wordCount;
};

export function sumMatches(inputTokens, sTokens) {
    let matches = 0;
    for (let token in inputTokens) {
        if (sTokens[token]) {
            matches += Math.min(inputTokens[token], sTokens[token]);
        }
    }
    return matches;
};

export function mostMatchingString(inputString, stringList) {
    const inputTokens = countWords(inputString);
    let maxMatches = 0;
    let mostMatchingString = null;
    let mostMatchingTokens = null;
    let index = 0;

    for (let idx = 0; idx < stringList.length; idx++) {
        const s = stringList[idx];
        const sTokens = countWords(s);
        const matches = sumMatches(inputTokens, sTokens);
        if (mostMatchingString === null || (matches >= maxMatches && Object.keys(sTokens).length < Object.keys(mostMatchingTokens).length)) {
            maxMatches = matches;
            mostMatchingString = s;
            mostMatchingTokens = sTokens;
            index = idx;
        }
    }

    return [mostMatchingString, index];
};

// fetchData are given input parameters of baseUrl and hotel_name, and returns queryResults 
export async function fetchData(baseUrl, hotel_name) {
    let queryResults = [];
    let i = 1;
    let keepFetching = true;

    while (keepFetching) {
        let url = `${baseUrl}?searchVal=${hotel_name}&returnGeom=Y&getAddrDetails=Y&pageNum=${i}`;
        const response = await fetch(url);
        const data = await response.json();
        debugger
        if (data['results'].length === 0) {
            keepFetching = false;
        } else {
            i += 1;
            for (let result of data['results']) {
                queryResults.push(result);
            }
        }
    }

    return queryResults;
};
//    end of extracted directly from SearchOM.js and modified to fit the context of Explore.js