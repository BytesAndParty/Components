import React from "react";
import styled from "styled-components";

const Button = () => {
	return (
		<StyledWrapper>
			<button className="jelly-btn">
				<span className="jelly-btn__text">Click me</span>
				<span className="jelly-btn__blob jelly-btn__blob--1" />
				<span className="jelly-btn__blob jelly-btn__blob--2" />
				<span className="jelly-btn__blob jelly-btn__blob--3" />
				<span className="jelly-btn__gloss" />
				<svg
					className="jelly-btn__svg"
					xmlns="http://www.w3.org/2000/svg"
					version="1.1"
					style={{ display: "block", width: 0, height: 0 }}
				>
					<defs>
						<filter id="jelly-goo">
							<feGaussianBlur
								in="SourceGraphic"
								stdDeviation={6}
								result="blur"
							/>
							<feColorMatrix
								in="blur"
								mode="matrix"
								values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
								result="goo"
							/>
							<feComposite
								in="SourceGraphic"
								in2="goo"
								operator="atop"
							/>
						</filter>
					</defs>
				</svg>
			</button>
		</StyledWrapper>
	);
};

const StyledWrapper = styled.div`
	.jelly-btn {
		--jelly-bg: #6c63ff;
		--jelly-hover: #7d75ff;
		--jelly-text: #fff;
		--jelly-shadow: rgba(108, 99, 255, 0.3);

		position: relative;
		padding: 0.85em 2.2em;
		border: none;
		border-radius: 1.2em;
		background: var(--jelly-bg);
		color: var(--jelly-text);
		font-family: inherit;
		font-size: 1em;
		font-weight: 600;
		cursor: pointer;
		overflow: visible;
		filter: url(#jelly-goo);
		transition:
			transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1),
			box-shadow 0.4s ease;
		box-shadow: 0 0.2em 0.8em var(--jelly-shadow);
	}

	/* текст */

	.jelly-btn__text {
		position: relative;
		z-index: 2;
		display: block;
		transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	/* блобы */

	.jelly-btn__blob {
		position: absolute;
		border-radius: 50%;
		background: var(--jelly-bg);
		transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
		z-index: -1;
	}

	.jelly-btn__blob--1 {
		width: 1.6em;
		height: 1.6em;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%) scale(0);
	}

	.jelly-btn__blob--2 {
		width: 1.2em;
		height: 1.2em;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%) scale(0);
	}

	.jelly-btn__blob--3 {
		width: 0.9em;
		height: 0.9em;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%) scale(0);
	}

	/* стеклянный блик */

	.jelly-btn__gloss {
		position: absolute;
		top: 0.1em;
		left: 10%;
		right: 10%;
		height: 40%;
		border-radius: 1em 1em 50% 50%;
		background: linear-gradient(
			180deg,
			rgba(255, 255, 255, 0.25) 0%,
			rgba(255, 255, 255, 0.05) 100%
		);
		pointer-events: none;
		transition: opacity 0.3s ease;
	}

	/* svg фильтр скрыт */

	.jelly-btn__svg {
		position: absolute;
		pointer-events: none;
	}

	/* hover — тянется + блобы вылезают */

	.jelly-btn:hover {
		transform: scaleX(1.06) scaleY(0.94);
		box-shadow: 0 0.3em 1.2em var(--jelly-shadow);
		background: var(--jelly-hover);
	}

	.jelly-btn:hover .jelly-btn__text {
		transform: scaleX(0.94) scaleY(1.06);
	}

	.jelly-btn:hover .jelly-btn__blob--1 {
		transform: translate(-160%, -120%) scale(1);
	}

	.jelly-btn:hover .jelly-btn__blob--2 {
		transform: translate(120%, -100%) scale(1);
		transition-delay: 0.05s;
	}

	.jelly-btn:hover .jelly-btn__blob--3 {
		transform: translate(-80%, 130%) scale(1);
		transition-delay: 0.1s;
	}

	.jelly-btn:hover .jelly-btn__gloss {
		opacity: 0.7;
	}

	/* active — сжимается обратно */

	.jelly-btn:active {
		transform: scaleX(0.94) scaleY(1.06);
		transition-duration: 0.1s;
		box-shadow: 0 0.15em 0.5em var(--jelly-shadow);
	}

	.jelly-btn:active .jelly-btn__text {
		transform: scaleX(1.06) scaleY(0.94);
		transition-duration: 0.1s;
	}

	.jelly-btn:active .jelly-btn__blob {
		transform: translate(-50%, -50%) scale(0) !important;
		transition-duration: 0.15s;
	}

	.jelly-btn:active .jelly-btn__gloss {
		opacity: 0.3;
	}

	/* focus */

	.jelly-btn:focus-visible {
		outline: 0.15em solid var(--jelly-hover);
		outline-offset: 0.25em;
	}
`;

export default Button;
