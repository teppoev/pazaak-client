import React from "react";

export default function CardColors() {
    const positiveBaseColor = "rgb(0,0,120)"
    const positiveOpacityColor = "rgb(0,0,255)"
    const negativeBaseColor = "rgb(120,0,0)"
    const negativeOpacityColor = "rgb(255,0,0)"
    const specialBaseColor = "rgb(120,120,0)"
    const specialOpacityColor = "rgb(255,255,0)"
    const simpleBaseColor = "rgb(0,120,0)"
    const simpleOpacityColor = "rgb(0,255,0)"
    const tiebreakerBaseColor = "rgb(60,0,60)"
    const tiebreakerOpacityColor = "rgb(10,0,10)"

    return (
        <defs>
            <radialGradient id="svg-card-gradient-simple" cy="37.5%">
                <stop offset="10%" stopColor={simpleOpacityColor}/>
                <stop offset="95%" stopColor={simpleBaseColor}/>
            </radialGradient>
            <radialGradient id="svg-card-gradient-positive" cy="37.5%">
                <stop offset="10%" stopColor={positiveOpacityColor}/>
                <stop offset="95%" stopColor={positiveBaseColor}/>
            </radialGradient>
            <radialGradient id="svg-card-gradient-negative" cy="37.5%">
                <stop offset="10%" stopColor={negativeOpacityColor}/>
                <stop offset="95%" stopColor={negativeBaseColor}/>
            </radialGradient>
            <radialGradient id="svg-card-gradient-special" cy="37.5%">
                <stop offset="10%" stopColor={specialOpacityColor}/>
                <stop offset="95%" stopColor={specialBaseColor}/>
            </radialGradient>
            <radialGradient id="svg-card-gradient-changeable-1" cy="75%" r="100%">
                <stop offset="10%" stopColor={positiveOpacityColor}/>
                <stop offset="95%" stopColor={positiveBaseColor}/>
            </radialGradient>
            <radialGradient id="svg-card-gradient-changeable-2" cy="-25%" r="100%">
                <stop offset="10%" stopColor={negativeOpacityColor}/>
                <stop offset="95%" stopColor={negativeBaseColor}/>
            </radialGradient>
            <radialGradient id="svg-card-gradient-changeable-3" cx="0%" cy="-150%" r="400%">
                <stop offset="10%" stopColor={positiveOpacityColor}/>
                <stop offset="95%" stopColor={positiveBaseColor}/>
            </radialGradient>
            <radialGradient id="svg-card-gradient-reverse-changeable-1" cy="75%" r="100%">
                <stop offset="10%" stopColor={negativeOpacityColor}/>
                <stop offset="95%" stopColor={negativeBaseColor}/>
            </radialGradient>
            <radialGradient id="svg-card-gradient-reverse-changeable-2" cy="-25%" r="100%">
                <stop offset="10%" stopColor={positiveOpacityColor}/>
                <stop offset="95%" stopColor={positiveBaseColor}/>
            </radialGradient>
            <radialGradient id="svg-card-gradient-reverse-changeable-3" cx="0%" cy="-150%" r="400%">
                <stop offset="10%" stopColor={negativeOpacityColor}/>
                <stop offset="95%" stopColor={negativeBaseColor}/>
            </radialGradient>
            <radialGradient id="svg-card-gradient-champion-tiebreaker" cy="37.5%" spreadMethod="reflect">
                <stop offset="10%" stopColor={tiebreakerOpacityColor}/>
                <stop offset="95%" stopColor={tiebreakerBaseColor}/>
            </radialGradient>
        </defs>
    )
}