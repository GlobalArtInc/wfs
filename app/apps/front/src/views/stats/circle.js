import {circliful} from 'js-plugin-circliful';

circliful.newCircle({
    percent: 50,
    text: "PVP",
    id: 'pvp_playtime',
    type: 'simple',
    foregroundCircleWidth: 10,
    backgroundCircleWidth: 10,
    strokeLinecap: "round"
})

circliful.newCircle({
    percent: 50,
    text: "PVP",
    id: 'pve_playtime',
    type: 'simple',
    color: "#ff4400",
    foregroundCircleWidth: 10,
    backgroundCircleWidth: 10,
    strokeLinecap: "round"
})

export default circliful
