import json
import sys

# Example: python3 optionAdder.py --add test '-p MEGATEST' 'A cool option' /home/sebastian/b-language-extension/
def modify_server(varName: str, comand: str, filename):
    var_marker: str = '//PYTHONVAR'
    if_marker: str = '//PYTHONIF'
    setting_marker: str = '//PYTHONSETTING'
    default_marker: str = '//PYTHONDEFAULT'
    python_command: str = '/*PYTHONCMD*/'

    with open(filename) as file:
        # Get only numbers
        file_handler = file.readlines()
    new_file = []
    for line in file_handler:
        if setting_marker in line:
            new_file.append('\t' + varName + ':boolean\n')
        if default_marker in line:
            new_file.append('\t' + varName + ':false,\n')
        if var_marker in line:
            new_file.append('\tlet ' + varName + '=""\n\t')
        if if_marker in line:
            new_file.append('\n\tif(settings.' + varName + ' == true){ \n\t\t' +
                            varName + '=' + ' "' + comand + '" ' + '\n' +
                            '\t}\n')
        if python_command in line:
            new_file.append('\t\t\t\t\t\t\t+ ' + varName + '\n')
        new_file.append(line)

    with open(filename, 'w') as f:
        f.writelines(new_file)


def modify_package(varName: str, description: str, filename:str):
    with open(filename) as file:
        attribute_dict = {
            'scope': 'window',
            'type': 'boolean',
            'default': 'false',
            'description': description}

        file_handler = json.load(file)
        file_handler['contributes']['configuration']['properties']['languageServer.' + varName] = attribute_dict

        json.dumps(file_handler)

    with open(filename, 'w') as f:
        json.dump(file_handler, f, indent=4)


def main():
    if len(sys.argv) >= 2:
        if sys.argv[1] == '--help':
            print('Helper to add boolean options quickly')
            print('Usage:')
            print('python --add optionName optionCommand optionDescription dirOfPackage.json')
        elif sys.argv[1] == '--add' and len(sys.argv) == 6:
            print(sys.argv)
            optionName = sys.argv[2]
            optionCommand = sys.argv[3]
            optionDescription = sys.argv[4]
            homeDir = sys.argv[5]

            modify_server(optionName, optionCommand, homeDir + '/server/src/server.ts')
            modify_package(optionName, optionDescription, homeDir + '/package.json')
        else:
            print("Something went wrong")


if __name__ == "__main__":
    main()
