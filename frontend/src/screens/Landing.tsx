import { useEffect, useRef } from "react";
import LanguagePicker from "../components/LanguagePicker";
import Logo from "../assets/logo_shrink.png";
import { FaAnglesDown } from "react-icons/fa6";
import { IoMenu } from "react-icons/io5";

export default function Landing() {
    const pathRef = useRef<SVGPathElement>(null);

    useEffect(() => {
        const path = pathRef.current;
        if (!path) return;
        const length = path.getTotalLength();
        path.style.strokeDasharray = String(length);
        path.style.strokeDashoffset = String(length);
        path.getBoundingClientRect();
        path.style.transition = "stroke-dashoffset 3s ease-in-out";
        path.style.strokeDashoffset = "0";
    }, []);

    return (
        <>
            <div className="flex justify-between items-center">
                <LanguagePicker />
                <IoMenu className="text-4xl mr-4" />
            </div>
            <div className="flex justify-center mb-8">
                <img src={Logo} alt="Logo" className="w-70 brightness-0 drop-shadow-sm drop-shadow-gray-300" />
            </div>
            <div className="font-bold flex flex-col w-fit mx-auto my-8">
                <span className="text-4xl">NIECH ZGADNĘ</span>
                <span className="text-xl">
                    <span>MUSISZ WYMIENIĆ </span>
                    <span className="text-rotate">
                        <span className="text-secondary">
                            <span>OKNA?</span>
                            <span>RYNNY?</span>
                            <span>DACHÓWKI?</span>
                        </span>
                    </span>
                </span>
            </div>
            <div className="flex my-12">
                <div>
                    <svg
                        version="1.1"
                        id="svg1"
                        width="100"
                        height="100"
                        viewBox="0 0 266.35385 197.52087"
                        xlinkHref="http://www.w3.org/1999/xlink"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-42 ml-8"
                    >
                        <g
                            id="layer1"
                            transform="translate(-23.471834,-22.776345)">
                            <path
                                ref={pathRef}
                                style={{ fill: "#000000", fillOpacity: 0, stroke: "#ED254E", strokeWidth: 8, strokeLinecap: "round", strokeMiterlimit: "miter", strokeOpacity: 1, paintOrder: "normal" }}
                                d="m 27.471835,50.422988 c 0,0 7.650384,-14.953024 22.603408,-14.953024 14.953025,0 21.907919,10.084598 23.298898,29.210559 1.390979,19.125961 14.953024,27.471835 39.295159,11.475576 24.34213,-15.996258 21.21243,-24.689877 18.08272,-29.210558 -3.1297,-4.520682 -12.17106,0.347744 -17.73498,8.693618 -5.56391,8.345874 -12.51881,39.990646 -4.52068,54.943671 7.99813,14.95302 29.90605,19.12596 53.90044,-12.866556 23.99438,-31.992517 48.33652,-66.071502 48.33652,-66.071502 v 0 l 18.43047,30.253793 -0.69549,-35.12222 h 17.38724 l 0.34774,56.334649 33.03575,47.293286 c 0,0 14.95303,19.47371 0,35.12222 -14.95302,15.64851 -37.20869,21.56017 -45.20682,19.82145 -7.99813,-1.73872 -16.344,-6.9549 1.04324,-19.47371 17.38724,-12.51881 30.25379,5.56392 10.0846,21.56018 -20.1692,15.99626 -36.5132,28.86281 -36.5132,28.86281"
                                id="path6" />
                        </g>
                    </svg>
                </div>
                <div className="flex flex-col items-end w-fit mr-10 ml-auto font-bold text-2xl">
                    <span>TRAFIŁEŚ W </span>
                    <span className="text-accent">IDEALNE</span>
                    <span>MIEJSCE!</span>
                </div>
            </div>
            <div className="flex justify-center">
                <button className="btn btn-xl btn-ghost w-[80vw] border-2 border-primary shadow-lg font-bold">UMÓW WYCENĘ</button>
            </div>
            <div className="flex flex-col items-center m-8">
                <span className="flex gap-4 items-center mb-4">
                    ZOBACZ MOJĄ PRACĘ <FaAnglesDown className="animate-bounce" />
                </span>
                <figure className="diff aspect-16/9" tabIndex={0}>
                    <div className="diff-item-1" role="img" tabIndex={0}>
                        <img alt="daisy" src="https://img.daisyui.com/images/stock/photo-1560717789-0ac7c58ac90a.webp" />
                    </div>
                    <div className="diff-item-2" role="img">
                        <img
                            alt="daisy"
                            src="https://img.daisyui.com/images/stock/photo-1560717789-0ac7c58ac90a-blur.webp" />
                    </div>
                    <div className="diff-resizer"></div>
                </figure>
            </div>
        </>
    )
}