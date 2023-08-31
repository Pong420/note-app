import { Group, UnstyledButton, createStyles } from '@mantine/core';
import { TITLE_BAR_HEIGHT } from '@/constants';
import { IconSearch } from '@tabler/icons-react';
import { usePreferences } from '@/hooks/usePreferences';

const useStyles = createStyles((theme, { darkMode }: { darkMode: boolean }) => {
  const [backgroundColor, btnBackground, btnBorderColor, btnColor] = darkMode
    ? ['#3d3d3d', `#484848`, `#696969`, `#999`]
    : [theme.colors.gray[5], theme.colors.gray[1], '#c9c9c9', '#666'];

  return {
    root: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: TITLE_BAR_HEIGHT,
      backgroundColor,

      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',

      flex: '0 0 auto !important',

      zIndex: 1001
    },

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    button: {
      appRegion: 'no-drag',
      width: '100%',
      height: TITLE_BAR_HEIGHT * 0.64,
      maxWidth: 500,
      fontSize: 12,
      borderWidth: 1,
      borderStyle: 'solid',
      borderRadius: 5,
      borderColor: btnBorderColor,
      backgroundColor: btnBackground,
      color: btnColor,

      ...theme.fn.hover({
        backgroundColor: darkMode ? theme.fn.lighten(btnBackground, 0.15) : theme.fn.darken(btnBackground, 0.1)
      })
    }
  };
});

const title = '';

export function TitleBar() {
  const darkMode = usePreferences('theme.darkMode');
  const { classes, cx } = useStyles({ darkMode });
  return (
    <div className={cx(classes.root, 'app-region')}>
      {title && (
        <UnstyledButton className={classes.button}>
          <Group position="center" spacing={4}>
            <IconSearch size="1.1em" style={{ transform: `scale(-1, 1)` }} />
            {title}
          </Group>
        </UnstyledButton>
      )}
    </div>
  );
}
