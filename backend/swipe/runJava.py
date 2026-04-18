import subprocess
import json

def runJava(payload, runner_class):
    process = subprocess.run(
        [
            "java",
            "-cp",
            "java_engine;java_engine/lib/gson-2.13.2.jar",
            runner_class
        ],
        input=json.dumps(payload),
        text=True,
        capture_output=True
    )

    if process.returncode != 0:
        raise Exception(process.stderr)

    if not process.stdout.strip():
        raise Exception("Java runner returned empty output")

    return json.loads(process.stdout)