@echo off
echo "Installing project's python dependencies"
pip install -r requirements.txt
echo "Creating an example local_settings file"
cd nar_common
copy example_local_settings.py local_settings.py
echo "Part 2 of 2 is ALMOST complete -- modify the secret key field in local_settings.py to complete setup"
notepad "local_settings.py"
echo "Part 2 of 2 is Complete! Great Jorb!"