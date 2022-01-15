"""Console script for mu_backend."""

import fire

def help():
    print("mu_backend")
    print("=" * len("mu_backend"))
    print("Skeleton project created by Python Project Wizard (ppw)")

def main():
    fire.Fire({
        "help": help
    })


if __name__ == "__main__":
    main() # pragma: no cover
