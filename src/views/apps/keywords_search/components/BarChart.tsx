import { Box, useTheme } from '@mui/material'
import { memo } from 'react'
import ReactApexcharts from 'src/@core/components/react-apexcharts'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

const BarChart = memo(
  ({
    data,
    isScrollable,
    seriesName,
    isVertical
  }: {
    data: {
      keys: string[]
      values: number[]
    }
    isScrollable?: boolean
    seriesName?: string
    isVertical?: boolean
  }) => {
    const theme = useTheme()

    const tagNames = data.keys

    const chartSize = Math.max(isVertical ? 800 : 600, tagNames.length * (tagNames.length <= 31 ? 40 : 30))

    const series = [
      {
        name: seriesName,
        data: data.values
      }
    ]

    const options: ApexCharts.ApexOptions = {
      chart: {
        type: 'bar',
        height: isVertical ? 'auto' : `${chartSize}px`,
        zoom: {
          type: isVertical ? 'y' : 'x',
          enabled: true,
          autoScaleYaxis: true
        },
        toolbar: {
          show: true,
          tools: {
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true
          }
        }
      },
      plotOptions: {
        bar: {
          horizontal: !isVertical,
          borderRadius: 10,
          columnWidth: '40px',

          dataLabels: {
            position: 'top'
          }
        }
      },
      colors: [hexToRGBA(theme.palette.primary.main, 1)],

      dataLabels: {
        enabled: true,
        offsetY: 0,
        style: {
          fontSize: '12px',
          colors: ['#304758']
        }
      },

      xaxis: {
        categories: tagNames,
        position: 'bottom',
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        crosshairs: {
          fill: {
            type: 'gradient',
            gradient: {
              colorFrom: '#FBB03B',
              colorTo: '#c58318',
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5
            }
          }
        },
        tooltip: {
          enabled: true
        },
        labels: {
          rotate: -50
        }
      },
      yaxis: {
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        labels: {
          show: true
        }
      }
    }

    return (
      <Box
        sx={{
          height: isScrollable || isVertical ? 'auto' : `${chartSize}px`,
          width: isScrollable ? (isVertical ? `${chartSize}px` : 'auto') : 'auto',

          svg: {
            overflow: 'initial'
          }
        }}
      >
        <ReactApexcharts
          type='bar'
          options={options}
          series={series}
          height={isVertical ? '550px' : `${chartSize}px`}
        />
      </Box>
    )
  }
)

export default BarChart
