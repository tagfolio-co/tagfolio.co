import React from 'react';

export function Home(){
    return (
        <div id='Home'>
            <HomeIntro/>
        </div>
    )
}

function HomeIntro(){
    return(
        <div id='Intro'>
            <div id='callToAction'>
                <h1>Build beautiful portfolios in seconds</h1>
                <h2>See what we’re talking about</h2>
                <br/>
                <h2>&#9660;</h2>
            </div>
        </div>
    )
}