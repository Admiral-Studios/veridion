import { Box, BoxProps, Step, StepIconProps, StepLabel, Stepper, Typography, styled, useTheme } from '@mui/material'
import React, { FC } from 'react'
import StepperWrapper from 'src/@core/styles/mui/stepper'
import useBgColor, { UseBgColorType } from 'src/@core/hooks/useBgColor'
import IconifyIcon from 'src/@core/components/icon'

const steps = [
  {
    title: 'Search'
  },
  {
    title: 'Analyze'
  }
]

const CustomBox = styled(Box)<BoxProps>(() => ({
  width: 20,
  height: 20,
  borderWidth: 3,
  borderRadius: '50%',
  borderStyle: 'solid'
}))

const StepperCustomDot = (props: StepIconProps) => {
  // ** Props
  const { active, completed, error } = props

  // ** Hooks
  const theme = useTheme()
  const bgColors: UseBgColorType = useBgColor()

  if (error) {
    return (
      <IconifyIcon icon='tabler:alert-triangle' fontSize={20} color={theme.palette.error.main} transform='scale(1.2)' />
    )
  } else if (completed) {
    return (
      <IconifyIcon icon='tabler:circle-check' fontSize={20} color={theme.palette.primary.main} transform='scale(1.2)' />
    )
  } else {
    return (
      <CustomBox
        sx={{
          borderColor: bgColors.primaryLight.backgroundColor,
          ...(active && {
            borderWidth: 5,
            borderColor: 'primary.main',
            backgroundColor: theme.palette.mode === 'light' ? 'common.white' : 'background.default'
          })
        }}
      />
    )
  }
}

const StepperIndicator: FC<{ activeStep: number; changeStepByClick: (s: number) => void }> = ({
  activeStep,
  changeStepByClick
}) => {
  return (
    <StepperWrapper sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((step, index) => {
          return (
            <Step
              key={index}
              onClick={() => {
                if (activeStep > index) {
                  changeStepByClick(index)
                }
              }}
            >
              <StepLabel StepIconComponent={StepperCustomDot} sx={{ cursor: 'pointer' }}>
                <div className='step-label'>
                  <div>
                    <Typography className='step-title'>{step.title}</Typography>
                  </div>
                </div>
              </StepLabel>
            </Step>
          )
        })}
      </Stepper>
    </StepperWrapper>
  )
}

export default StepperIndicator
