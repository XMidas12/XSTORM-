"""Simple Snake game using curses.
Use arrow keys to move the snake and eat food.
Press 'q' to quit."""

import curses
from curses import KEY_RIGHT, KEY_LEFT, KEY_UP, KEY_DOWN
from random import randint


def main(stdscr: curses.window) -> None:
    curses.curs_set(0)
    sh, sw = stdscr.getmaxyx()
    w = curses.newwin(sh, sw, 0, 0)
    w.keypad(True)
    w.nodelay(True)
    w.timeout(100)

    snk_x = sw // 4
    snk_y = sh // 2
    snake = [
        [snk_y, snk_x],
        [snk_y, snk_x - 1],
        [snk_y, snk_x - 2],
    ]

    food = [sh // 2, sw // 2]
    w.addch(food[0], food[1], curses.ACS_PI)

    key = KEY_RIGHT
    while True:
        next_key = w.getch()
        if next_key == ord("q"):
            break
        if next_key in [KEY_RIGHT, KEY_LEFT, KEY_UP, KEY_DOWN]:
            key = next_key

        head = [snake[0][0], snake[0][1]]
        if key == KEY_RIGHT:
            head[1] += 1
        elif key == KEY_LEFT:
            head[1] -= 1
        elif key == KEY_UP:
            head[0] -= 1
        elif key == KEY_DOWN:
            head[0] += 1

        if head[0] in [0, sh] or head[1] in [0, sw] or head in snake:
            break

        snake.insert(0, head)

        if head == food:
            while True:
                new_food = [randint(1, sh - 2), randint(1, sw - 2)]
                if new_food not in snake:
                    food = new_food
                    break
            w.addch(food[0], food[1], curses.ACS_PI)
        else:
            tail = snake.pop()
            w.addch(tail[0], tail[1], " ")

        w.addch(snake[0][0], snake[0][1], curses.ACS_CKBOARD)


if __name__ == "__main__":
    curses.wrapper(main)
