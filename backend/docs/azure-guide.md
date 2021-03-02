# Guide to running in Azure

Installation guide can be found [here](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli).

## Install CLI tools (Mac)

Install Azure tools, note no support for M1 Macs (yet)

```bash
brew update

# Install azure cli tools
brew install azure-cli

# Next up, install the azure functions tools
# see https://github.com/Azure/azure-functions-core-tools
brew tap azure/functions
brew install azure-functions-core-tools@3
# if upgrading on a machine that has 2.x installed
brew link --overwrite azure-functions-core-tools@3

#Next up, login (this will redirect to your browser)

az login
```

## Running Locally

More info on azure cloud function cli found [here](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local?tabs=macos%2Ccsharp%2Cbash)

To run the functions, navigate to the azure directory and run from there. Such as;

```bash
cd azure
func start --javascript --verbose --worker-runtime=node
```