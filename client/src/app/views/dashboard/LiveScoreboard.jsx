import React, { Fragment, useState, useEffect } from 'react'
import { Grid, Card } from '@material-ui/core'
import DoughnutChart from './shared/Doughnut'
import StatCards from './shared/StatCards'
import RowCards from './shared/RowCards'
import StatCards2 from './shared/StatCards2'
import UpgradeCard from './shared/UpgradeCard'
import Campaigns from './shared/Campaigns'
import { useTheme } from '@material-ui/styles'
import ResultsTable from './shared/ResultsTable'

const LiveScoreboard = () => {
    const theme = useTheme()
    const [raceTitle, setRaceTitle] = useState('Live Results')
    const [results, setResults] = useState([])

    return (
        <Fragment>
            <div className="analytics m-sm-30 mt-6">
                <Grid container spacing={3}>
                    <Grid item lg={4} md={4} sm={12} xs={12}>
                        <Card className="px-6 py-4 mb-6">
                            <small className="border-radius-4 bg-error text-white px-2 py-2px">
                                Live
                            </small>
                            <div className="card-title mt-4">{raceTitle}</div>
                            <div className="card-subtitle">[Meet Title]</div>
                            <hr />
                            <div className="raceTime text-center h1">00:00</div>
                            {/* <DoughnutChart
                                height="300px"
                                color={[
                                    theme.palette.primary.dark,
                                    theme.palette.primary.main,
                                    theme.palette.primary.light,
                                ]}
                            /> */}
                        </Card>

                        {/* <UpgradeCard /> */}

                        {/* <Campaigns /> */}
                    </Grid>
                    <Grid item lg={8} md={8} sm={12} xs={12}>
                        {/* <StatCards /> */}

                        {/* Top Selling Products */}
                        <ResultsTable results={results} />

                        {/* <StatCards2 /> */}

                        {/* <h4 className="card-title text-muted mb-4">
                            Ongoing Projects
                        </h4> */}
                        {/* <RowCards /> */}
                    </Grid>
                </Grid>
            </div>
        </Fragment>
    )
}

export default LiveScoreboard
