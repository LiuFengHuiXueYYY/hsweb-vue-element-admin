export default function getImport(list) {
  switch (list.length) {
    case 1:
      return import (
        `@/views/${list[0]}`
      )
    case 2:
      return import (
        `@/views/${list[0]}/${list[1]}`
      )
    case 3:
      return import (
        `@/views/${list[0]}/${list[1]}/${list[2]}`
      )
    case 4:
      return import (
        `@/views/${list[0]}/${list[1]}/${list[2]}/${list[3]}`
      )
    case 5:
      return import (
        `@/views/${list[0]}/${list[1]}/${list[2]}/${list[3]}/${list[4]}`
      )
    case 6:
      return import (
        `@/views/${list[0]}/${list[1]}/${list[2]}/${list[3]}/${list[4]}/${list[5]}`
      )
    case 7:
      return import (
        `@/views/${list[0]}/${list[1]}/${list[2]}/${list[3]}/${list[4]}/${list[5]}/${list[6]}`
      )
    case 8:
      return import (
        `@/views/${list[0]}/${list[1]}/${list[2]}/${list[3]}/${list[4]}/${list[5]}/${list[6]}/${list[7]}`
      )
    case 9:
      return import (
        `@/views/${list[0]}/${list[1]}/${list[2]}/${list[3]}/${list[4]}/${list[5]}/${list[6]}/${list[7]}/${list[8]}`
      )
    case 10:
      return import (
        `@/views/${list[0]}/${list[1]}/${list[2]}/${list[3]}/${list[4]}/${list[5]}/${list[6]}/${list[7]}/${list[8]}/${list[9]}`
      )
    case 11:
      return import (
        `@/views/${list[0]}/${list[1]}/${list[2]}/${list[3]}/${list[4]}/${list[5]}/${list[6]}/${list[7]}/${list[8]}/${list[9]}/${list[10]}`
      )
    case 12:
      return import (
        `@/views/${list[0]}/${list[1]}/${list[2]}/${list[3]}/${list[4]}/${list[5]}/${list[6]}/${list[7]}/${list[8]}/${list[9]}/${list[11]}`
      )
    default:
  }
}
