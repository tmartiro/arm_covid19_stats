const gi = require('node-gtk')
const Gtk = gi.require('Gtk', '3.0')
const https = require("https");
const url = "https://infogram.com/--1h7j4drmogk92nr";
let runMainLoop = true
let interval;




function getStats () {
    return new Promise((resolve, reject) => {
        https.get(url, res => {
  			res.setEncoding("utf8");
			let body = "";
            res.on("data", data => {
			    body += data;
  			});
              
            res.on("end", () => {
			    txt = body.split("\n");
			    for(let i=0; i<txt.length; i++) {
			    	if (txt[i].match(/infographicData/)){
                        let header = "";
                        r = txt[i];
                        r = r.replace("<script>window.infographicData=", "");
                        r = r.replace(";</script>", "");
                        r = r.replace("window.infographicData=","");
                        d = JSON.parse(r);
                        corona_data = d.elements.content.content.entities["f5b6e83c-39b1-47c6-a84f-cd7ebaa3b7b1"].props.chartData.data[0];
                        for (let i=0; i<corona_data[0].length; i++) {
                            if (i == 0) {
                                header += `${corona_data[corona_data.length-1][i]}\n`;
                            }else{
                                header += `${corona_data[0][i]}:${corona_data[corona_data.length-1][i]}\n`;
                            }
                        }
                        return resolve(header)
				    }
			    }
  			});
            
		});	
    })
     
}
 
gi.startLoop()
Gtk.init()
 
const win = new Gtk.Window()
const header = new Gtk.Label({ label: 'getting stats...' })
const vbox = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL })
const toolbar = new Gtk.Toolbar()
const button = { 
  refresh: Gtk.ToolButton.newFromStock(Gtk.STOCK_REFRESH),
}


button.refresh.on('clicked', async function() {
    header.label = "getting stats..."
    header.label = await getStats()
})


 
win.on('delete-event', () => false)
win.on('destroy', () => {
    runMainLoop = false
    Gtk.mainQuit()
})
 
toolbar.add(button.refresh)
vbox.add(toolbar)
vbox.add(header)


win.setDefaultSize(200, 80)
win.add(vbox)
win.showAll()


// workaround in order to make promises work
Gtk.main = function() {
   let interval
   interval = setInterval( () => {
     if( runMainLoop !== true ) { clearInterval(interval) }
     Gtk.mainIterationDo(false)
   }, 0)
}
Gtk.main();

(async function jsMain() {
    header.label = await getStats()
})();



