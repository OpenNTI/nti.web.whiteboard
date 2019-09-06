export default function SvgToLgObject(svgString) {

    if(!svgString.includes("nti-linear-gradient")){
        console.warn("svg file wasnt from nti");
        return null;
    };

    //find attributes
    const json = {
        "rotation":'',
        "stops":[],
    };

    const temp = document.createElement('div');
    temp.innerHTML = svgString;

    //get rotation of svg
    const rotation = temp.querySelector('linearGradient');
    json.rotation = rotation.getAttribute('gradientTransform');

    //make list of stops and add to json
    const nodelist = temp.querySelectorAll('stop');
    Array.from(nodelist).forEach((stop) => {
        json.stops.push({"offset": stop.getAttribute('offset'), "stopcolor": stop.getAttribute('stopcolor')});
    });

    return json;
};

