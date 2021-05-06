const https = require("https");
const url = "https://infogram.com/--1h7j4drmogk92nr";
let runMainLoop = true

function getStats() {
    return new Promise((resolve, reject) => {
        https.get(url, res => {
            res.setEncoding("utf8");
            let body = "";
            res.on("data", data => {
                body += data;
            });

            res.on("end", () => {
                txt = body.split("\n");
                for (let i = 0; i < txt.length; i++) {
                    if (txt[i].match(/infographicData/)) {
                        let header = "";
                        r = txt[i];
                        r = r.replace("<script>window.infographicData=", "");
                        r = r.replace(";</script>", "");
                        r = r.replace("window.infographicData=", "");
                        d = JSON.parse(r);
                        corona_data = d.elements.content.content.entities["f5b6e83c-39b1-47c6-a84f-cd7ebaa3b7b1"].props.chartData.data[0];
                        for (let i = 0; i < corona_data[0].length; i++) {
                            if (i == 0) {
                                header += `${corona_data[corona_data.length - 1][i]}\n`;
                            } else {
                                header += `${corona_data[0][i]}:${corona_data[corona_data.length - 1][i]}\n`;
                            }
                        }
                        return resolve(header)
                    }
                }
            });

        });
    })
}

async function main() {
   result = await getStats()
   console.log(result)
}

main();


