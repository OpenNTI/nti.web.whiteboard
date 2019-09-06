
//input object
//output string
export default function LgObjectToSvg(lgObject) {

    //save from object to string before writing out
    var svgString = `
        <!-- nti-linear-gradient test -->
        <svg xmlns="http://www.w3.org/2000/svg">
        <defs>
                <linearGradient id="Gradient" gradientTransform="${lgObject.rotation}" viewBox="0 0 10 1">`
                + printStops(lgObject) + 
                `</linearGradient>
            </defs>
            <rect x="0" y="0" height="100%" width="100%"  fill="url(#Gradient)" />
        </svg>`;

        
        return svgString;
    }
    
    const printStops = (lgObject) => {
        var s = '';
        lgObject.stops.map((lg) => {
            s += `<stop offset="${lg.offset}" stopColor="${lg.stopcolor}"/>`
        })
        return s;
    }