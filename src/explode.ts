import chalk from "chalk";

export function explode()
: (string) {
  const str = chalk.red(explosion);
  console.log(str);
  return str;
}

export const explosion = `
                             ____
                     __,-~~/~(( )\`---.
                   _/_,---(      ,***))
               __ /***-*(()< // /(( )**\\___
- ------===;;;'====------------------===;;;===----- -  -
                  \/**~\"~\"~\"~\"~\"~\\~\"~)~\"/
                  (_((*^*\\  (<< **>=**-\\)
                   \\_( _ <**v**-_**>_>'
                      ~ \`-i' ::>|--\"
                          I;|.|.|
                         <|i::|i|\`.
                        (\` ^'\"\`-' \")
`;
