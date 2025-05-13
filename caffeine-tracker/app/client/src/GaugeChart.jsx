import PropTypes from 'prop-types';

const fillColor = '#3d2c2c';

function GaugeChart({ caffeineIntake, safetyLimit }) {
    const chartMax = getChartMax();
    const step = getStepSize();
    const markers = getMarkers();
    const percentage = Math.min(100, Math.max(0, (caffeineIntake / chartMax) * 100));

    function getChartMax() {
        let initialMax = safetyLimit + 50;
        let returnMax = initialMax;
        if (caffeineIntake >= safetyLimit) {
            let count = 0;
            while (caffeineIntake >= returnMax - 50) {
                count++;
                returnMax = safetyLimit * (count + 1);
            }
        }
        return returnMax;
    };

    function getStepSize() {
        let stepsize = 50;
        if (caffeineIntake > safetyLimit) {
            stepsize = chartMax / 8;
        }
        // Round to the nearest 50
        return Math.round(stepsize / 50) * 50;
    };

    function getMarkers() {
        let result = [];
        for (let i = 0; i <= chartMax; i += step) {
            result.push({
                value: i,
                position: (i / chartMax) * 100,
            });
        }
        return result;
    };

    const renderMarkers = () => (
        <div className="absolute top-4 left-4 h-full z-1">
            {markers.map((marker) => {
                const isInsideFill = marker.position >= percentage + 1;
                const textColor = isInsideFill ? "text-coffee-dark" : "text-white";
                return (
                    <div
                        key={marker.value}
                        className="absolute flex items-center"
                        style={{ top: `${100 - marker.position}%` }}
                    >
                        <span className={`text-md ${textColor} font-medium`}>
                            {marker.value}
                        </span>
                    </div>
                );
            })}
        </div>
    );

    const renderFill = () => (
        <div
            className="absolute bottom-0 w-full shadow-2xl transition-transform duration-500"
            style={{
                height: "100%",
                transform: `translateY(${102 - percentage}%)`,
                backgroundColor: fillColor,
                opacity: 1,
            }}
        />
    );

    const renderIntake = () => (
        <div
            className="absolute right-30 flex items-center justify-end transition-all text-white duration-500"
            style={{
                top: `${100 - percentage}%`,
                transform: 'translateY(100%)',
            }}
        >
            <span className="text-3xl font-bold">{caffeineIntake}</span>
            <span className="pt-1 pl-1 text-lg font-medium">mg</span>
        </div>
    );

    const renderSafetyLimit = () => {
        const safetyLimitPercentage = Math.min(100, Math.max(0, (safetyLimit / chartMax) * 100));
      
        return (
            <div
                className="group absolute left-0 right-0 px-10 border-t-4 border-dotted border-coffee-light z-2"
                style={{ top: `${102 - safetyLimitPercentage}%` }}
            >
                <div className="w-full text-center absolute left-1/2 transform -translate-x-1/2 -top-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-md font-bold p-1 rounded inline-block text-coffee-light">
                    Limit : {safetyLimit} mg
                </div>
            </div>
        );
    };
    

    return (
        <div className="flex flex-col flex-grow items-center">
            <div className="relative w-full h-full">
                
                <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden">
                    {renderMarkers()}
                    {renderFill()}
                    {renderSafetyLimit()}
                </div>
                {renderIntake()}
            </div>
        </div>
    );
}
GaugeChart.propTypes = {
    caffeineIntake: PropTypes.number,
    safetyLimit: PropTypes.number,
};

export default GaugeChart;
